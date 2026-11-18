<script setup lang="ts">
import { OnClickOutside } from "@vueuse/components";
import { useElementBounding, useThrottleFn, useWindowSize } from "@vueuse/core";
import { computed, onUnmounted, ref, useTemplateRef, watch } from "vue";
import { ChevronLeft, ChevronRight, X as Close } from "@lucide/vue";
import { useImageStore } from "../../../stores/imageStore";
import ElyButton from "./ElyButton.vue";
import { clamp } from "./_utils/numberUtils";

const imageStore = useImageStore();

const currentImage = computed(() => imageStore.images[imageStore.index]);
const shouldShowNav = computed(() => imageStore.images.length > 1);

// Ignore navigation and close buttons when detecting backdrop clicks
const clickOutsideOptions = {
  ignore: [".elysium-ui__image-preview__button"],
};

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;

const scale = ref(1);
const offset = ref({ translateX: 0, translateY: 0 });
const isDragging = ref(false);
const imageRef = useTemplateRef<HTMLImageElement>("imageRef");

// Track active pointers uniformly across mouse drag, single-touch pan, and two-finger pinch
const activePointers = new Map<number, { x: number; y: number }>();
let lastPinchDistance = 0;
let dragDistance = 0;

const { width: imageWidth, height: imageHeight } = useElementBounding(imageRef);
const { width: windowWidth, height: windowHeight } = useWindowSize();

enum ScrollIntent {
  Resize = 0,
  Pan = 1,
}

const scrollIntent = ref(ScrollIntent.Resize);

const setIntentThrottled = useThrottleFn((intent: ScrollIntent) => {
  scrollIntent.value = intent;
}, 500);

watch(
  () => [imageWidth.value, imageHeight.value],
  ([newWidth, newHeight]) => {
    // Switch wheel behavior to panning when zoomed image exceeds the viewport
    if (newWidth > windowWidth.value || newHeight > windowHeight.value) {
      setIntentThrottled(ScrollIntent.Pan);
    } else {
      setIntentThrottled(ScrollIntent.Resize);
    }
  }
);

function resetTransform() {
  scale.value = 1;
  offset.value = { translateX: 0, translateY: 0 };
  activePointers.clear();
  lastPinchDistance = 0;
  dragDistance = 0;
  isDragging.value = false;
}

function updateScale(delta: number) {
  scale.value = clamp(scale.value + delta * 0.01, MIN_SCALE, MAX_SCALE);
}

function updateOffset(deltaX = 0, deltaY = 0) {
  // CSS transform order is scale() then translate3d() (right-to-left),
  // so divide by scale to keep panning 1:1 with pointer movement.
  const s = scale.value;
  const maxX = Math.max(imageWidth.value, 1);
  const maxY = Math.max(imageHeight.value, 1);
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
  } else if (activePointers.size === 2) {
    lastPinchDistance = getPinchDistance();
  }
  isDragging.value = true;
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

function handlePointerEnd(event: PointerEvent) {
  activePointers.delete(event.pointerId);
  if (activePointers.size < 2) {
    lastPinchDistance = 0;
  }
  if (activePointers.size === 0) {
    isDragging.value = false;
  }
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

watch(
  [() => imageStore.visible, () => imageStore.index],
  ([visible], [prevVisible]) => {
    resetTransform();
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

function handleClickOutside() {
  if (isDragging.value || dragDistance > 4) return;
  handleClose();
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
          class="elysium-ui elysium-ui__image-preview__container fixed z-999 inset-0 flex flex-col items-center justify-center gap-4 select-none"
          @wheel="handleScroll"
          @pointerdown="handlePointerDown"
          @pointermove="handlePointerMove"
          @pointerup="handlePointerEnd"
          @pointercancel="handlePointerEnd"
          @lostpointercapture="handlePointerEnd"
        >
          <OnClickOutside
            :options="clickOutsideOptions"
            @trigger="handleClickOutside"
          >
            <img
              ref="imageRef"
              draggable="false"
              class="elysium-ui__image-preview--image w-full max-w-screen-md object-contain flex-1"
              :src="currentImage.src"
              :alt="currentImage.alt || 'Image preview'"
              :style="{
                transform: `scale(${scale}) translate3d(${offset.translateX}px, ${offset.translateY}px, 0)`,
              }"
            />
          </OnClickOutside>

          <ElyButton
            v-if="shouldShowNav"
            secondary
            size="icon"
            class="elysium-ui__image-preview__button elysium-ui__image-preview__button__nav elysium-ui__image-preview__button__nav--prev -translate-y-1/2"
            aria-label="上一张图像"
            @click="imageStore.prevImagePreview()"
          >
            <ChevronLeft :size="18" />
          </ElyButton>

          <ElyButton
            v-if="shouldShowNav"
            secondary
            size="icon"
            class="elysium-ui__image-preview__button elysium-ui__image-preview__button__nav elysium-ui__image-preview__button__nav--next -translate-y-1/2"
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

  &__button {
    position: absolute;
    background-color: var(--gouache-paper);
    border: 1px solid var(--color-accent-border-300);

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
