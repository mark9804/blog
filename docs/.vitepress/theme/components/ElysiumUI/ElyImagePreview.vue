<script setup lang="ts">
import { useThrottleFn, useWindowSize } from "@vueuse/core";
import {
  computed,
  nextTick,
  onUnmounted,
  ref,
  useTemplateRef,
  watch,
} from "vue";
import { ChevronLeft, ChevronRight, ImageOff, X as Close } from "@lucide/vue";
import { useImageStore } from "../../../stores/imageStore";
import ElyButton from "./ElyButton.vue";
import ElySpinner from "./ElySpinner.vue";
import { clamp } from "./_utils/numberUtils";

type PreviewLoadState = "loading" | "loaded" | "error";

const imageStore = useImageStore();

const currentImage = computed(() => imageStore.images[imageStore.index]);
const shouldShowNav = computed(() => imageStore.images.length > 1);

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const TAP_SLOP_PX = 4;

const scale = ref(1);
const offset = ref({ translateX: 0, translateY: 0 });
const baseSize = ref({ width: 0, height: 0 });
const previewState = ref<PreviewLoadState>("loading");

const imageRef = useTemplateRef<HTMLImageElement>("imageRef");
const fallbackRef = useTemplateRef<HTMLDivElement>("fallbackRef");

// Track active pointers uniformly across mouse drag, single-touch pan, and two-finger pinch
const activePointers = new Map<number, { x: number; y: number }>();
let lastPinchDistance = 0;
let dragDistance = 0;
let hadMultiTouch = false;

const { width: windowWidth, height: windowHeight } = useWindowSize();

enum ScrollIntent {
  Resize = 0,
  Pan = 1,
}

const scrollIntent = ref(ScrollIntent.Resize);

const setIntentThrottled = useThrottleFn((intent: ScrollIntent) => {
  scrollIntent.value = intent;
}, 500);

function syncBaseSize() {
  const el = imageRef.value;
  if (!el) return;
  baseSize.value = {
    width: el.offsetWidth,
    height: el.offsetHeight,
  };
}

watch(
  () => [
    baseSize.value.width * scale.value,
    baseSize.value.height * scale.value,
    windowWidth.value,
    windowHeight.value,
  ],
  ([scaledWidth, scaledHeight, winW, winH]) => {
    // Switch wheel behavior to panning when the scaled visual box exceeds the viewport
    if (scaledWidth > winW || scaledHeight > winH) {
      setIntentThrottled(ScrollIntent.Pan);
    } else {
      setIntentThrottled(ScrollIntent.Resize);
    }
  }
);

watch([windowWidth, windowHeight], () => {
  if (imageStore.visible && previewState.value === "loaded") {
    syncBaseSize();
  }
});

function resetTransform() {
  scale.value = 1;
  offset.value = { translateX: 0, translateY: 0 };
  baseSize.value = { width: 0, height: 0 };
  scrollIntent.value = ScrollIntent.Resize;
  activePointers.clear();
  lastPinchDistance = 0;
  dragDistance = 0;
  hadMultiTouch = false;
}

function updateScale(delta: number) {
  scale.value = clamp(scale.value + delta * 0.01, MIN_SCALE, MAX_SCALE);
}

function updateOffset(deltaX = 0, deltaY = 0) {
  // CSS transform order is scale() then translate3d() (right-to-left),
  // so divide by scale to keep panning 1:1 with pointer movement.
  const s = scale.value;
  const maxX = Math.max(baseSize.value.width || windowWidth.value, 1);
  const maxY = Math.max(baseSize.value.height || windowHeight.value, 1);
  offset.value = {
    translateX: clamp(offset.value.translateX + deltaX / s, -maxX, maxX),
    translateY: clamp(offset.value.translateY + deltaY / s, -maxY, maxY),
  };
}

function getPinchDistance(): number {
  const pts = Array.from(activePointers.values());
  if (pts.length < 2) return 0;
  return Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
}

function handleScroll(event: WheelEvent) {
  event.preventDefault();
  if (event.ctrlKey || scrollIntent.value === ScrollIntent.Resize) {
    updateScale(-event.deltaY);
  } else {
    updateOffset(-event.deltaX, -event.deltaY);
  }
}

function handlePointerDown(event: PointerEvent) {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  if (
    event.target instanceof Element &&
    event.target.closest(".elysium-ui__image-preview__button")
  ) {
    return;
  }

  (event.currentTarget as HTMLElement | null)?.setPointerCapture?.(
    event.pointerId
  );
  activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

  if (activePointers.size === 1) {
    dragDistance = 0;
    hadMultiTouch = false;
  } else {
    hadMultiTouch = true;
    if (activePointers.size === 2) {
      lastPinchDistance = getPinchDistance();
    }
  }
}

function handlePointerMove(event: PointerEvent) {
  const prev = activePointers.get(event.pointerId);
  if (!prev) return;

  const curr = { x: event.clientX, y: event.clientY };
  activePointers.set(event.pointerId, curr);

  if (activePointers.size === 1) {
    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;
    dragDistance += Math.hypot(dx, dy);
    updateOffset(dx, dy);
  } else if (activePointers.size === 2) {
    const distance = getPinchDistance();
    const delta = distance - lastPinchDistance;
    dragDistance += Math.abs(delta);
    if (Math.abs(delta) > 1) {
      updateScale(delta);
      lastPinchDistance = distance;
    }
  }
}

function releasePointer(pointerId: number) {
  activePointers.delete(pointerId);
  if (activePointers.size < 2) {
    lastPinchDistance = 0;
  }
}

// Geometric hit-test against getBoundingClientRect(), which natively reflects
// the post-scale() and post-translate3d() visual box rather than the unscaled DOM layout box.
function isPointInsideActiveContent(clientX: number, clientY: number): boolean {
  const targetEl =
    previewState.value === "loaded"
      ? imageRef.value
      : previewState.value === "error"
        ? fallbackRef.value
        : null;

  if (!targetEl) return false;
  const rect = targetEl.getBoundingClientRect();
  return (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  );
}

function handlePointerUp(event: PointerEvent) {
  if (!activePointers.has(event.pointerId)) return;
  releasePointer(event.pointerId);

  if (
    activePointers.size === 0 &&
    !hadMultiTouch &&
    dragDistance <= TAP_SLOP_PX &&
    !isPointInsideActiveContent(event.clientX, event.clientY)
  ) {
    handleClose();
  }
}

function handlePointerCancel(event: PointerEvent) {
  releasePointer(event.pointerId);
}

function handleImageLoad() {
  previewState.value = "loaded";
  syncBaseSize();
}

function handleKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case "ArrowLeft":
    case "ArrowUp":
      event.preventDefault();
      imageStore.prevImagePreview();
      break;
    case "ArrowRight":
    case "ArrowDown":
      event.preventDefault();
      imageStore.nextImagePreview();
      break;
    case "Escape":
      event.preventDefault();
      imageStore.closeImagePreview();
      break;
  }
}

function syncPreviewState() {
  if (!currentImage.value?.src) {
    previewState.value = "error";
    return;
  }
  const el = imageRef.value;
  if (!el || !el.complete) return;
  if (el.naturalWidth > 0) {
    previewState.value = "loaded";
    syncBaseSize();
  } else {
    previewState.value = "error";
  }
}

watch(
  [() => imageStore.visible, () => imageStore.index],
  ([visible], [prevVisible]) => {
    resetTransform();
    if (visible) {
      previewState.value = currentImage.value?.src ? "loading" : "error";
      nextTick(syncPreviewState);
    }
    if (visible !== prevVisible) {
      if (visible) {
        document.addEventListener("keydown", handleKeydown);
      } else {
        document.removeEventListener("keydown", handleKeydown);
      }
    }
  }
);

function handleClose() {
  imageStore.closeImagePreview();
}

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
  resetTransform();
  imageStore.closeImagePreview();
});
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="imageStore.visible && currentImage"
          class="elysium-ui elysium-ui__image-preview__container fixed z-999 inset-0 flex items-center justify-center select-none"
          @wheel="handleScroll"
          @pointerdown="handlePointerDown"
          @pointermove="handlePointerMove"
          @pointerup="handlePointerUp"
          @pointercancel="handlePointerCancel"
          @lostpointercapture="handlePointerCancel"
        >
          <ElySpinner
            v-if="previewState === 'loading'"
            :size="28"
            label="LOADING"
            class="pointer-events-none absolute"
          />

          <img
            v-if="previewState !== 'error'"
            :key="currentImage.src"
            ref="imageRef"
            draggable="false"
            class="elysium-ui__image-preview--image block"
            :class="{ 'opacity-0': previewState === 'loading' }"
            :src="currentImage.src"
            :alt="currentImage.alt || 'Image preview'"
            :style="{
              transform: `scale(${scale}) translate3d(${offset.translateX}px, ${offset.translateY}px, 0)`,
            }"
            @load="handleImageLoad"
            @error="previewState = 'error'"
          />
          <div
            v-else
            ref="fallbackRef"
            class="elysium-ui__image-preview__fallback"
          >
            <ImageOff :size="24" :stroke-width="1.5" />
            <span>图片加载失败</span>
          </div>

          <ElyButton
            v-if="shouldShowNav"
            secondary
            size="icon"
            class="elysium-ui__image-preview__button elysium-ui__image-preview__button__nav elysium-ui__image-preview__button__nav--prev"
            aria-label="上一张图像"
            @click="imageStore.prevImagePreview()"
          >
            <ChevronLeft :size="18" />
          </ElyButton>

          <ElyButton
            v-if="shouldShowNav"
            secondary
            size="icon"
            class="elysium-ui__image-preview__button elysium-ui__image-preview__button__nav elysium-ui__image-preview__button__nav--next"
            aria-label="下一张图像"
            @click="imageStore.nextImagePreview()"
          >
            <ChevronRight :size="18" />
          </ElyButton>

          <ElyButton
            secondary
            size="icon"
            class="elysium-ui__image-preview__button elysium-ui__image-preview__button--close"
            aria-label="关闭图像预览"
            @click="handleClose"
          >
            <Close :size="18" />
          </ElyButton>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<style lang="scss" scoped>
.elysium-ui__image-preview {
  &__container {
    touch-action: none;
    background-color: color-mix(in srgb, var(--gouache-paper) 84%, transparent);
  }

  &--image {
    width: auto;
    height: auto;
    max-width: min(92vw, 48rem);
    max-height: 88dvh;
    object-fit: contain;
    will-change: transform;
  }

  &__button {
    position: absolute;
    width: 36px;
    height: 36px;
    box-shadow: 3px 3px 0 0
      color-mix(in srgb, var(--gouache-pigment) 26%, var(--gouache-paper));

    &:not(:hover) {
      border-color: var(--color-accent-border-400);
    }

    &__nav {
      top: 50%;
      transform: translateY(-50%);

      &--prev {
        left: 16px;
      }

      &--next {
        right: 16px;
      }
    }

    &--close {
      top: 16px;
      right: 16px;
    }
  }

  &__fallback {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 36px 48px;
    font-family: var(--font-family-base);
    font-size: 13px;
    color: var(--color-accent-text-tertiary);
    background-color: var(--gouache-paper);
    border: 1px dashed var(--color-accent-border-300);
    box-shadow: 5px 5px 0 0 var(--gouache-wash);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none !important;
  }
}
</style>
