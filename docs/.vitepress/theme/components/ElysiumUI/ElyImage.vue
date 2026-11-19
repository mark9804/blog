<script setup lang="ts">
import {
  computed,
  inject,
  nextTick,
  onMounted,
  ref,
  useTemplateRef,
  watch,
} from "vue";
import { ImageOff, RotateCw } from "@lucide/vue";
import type { ImageProps } from "./types/ImageProps";
import { GALLERY_INJECTION_KEY } from "./types/GalleryContext";
import { useImageStore } from "../../../stores/imageStore";
import { parseSize } from "./_utils/styleUtils";
import ElyButton from "./ElyButton.vue";
import ElySpinner from "./ElySpinner.vue";

type ImageLoadState = "loading" | "loaded" | "error";

const props = withDefaults(defineProps<ImageProps>(), {
  lazy: true,
  previewable: true,
});

const store = useImageStore();
const gallery = inject(GALLERY_INJECTION_KEY, null);
const imgRef = useTemplateRef<HTMLImageElement>("imgRef");

const state = ref<ImageLoadState>(props.image.src ? "loading" : "error");
const retryKey = ref(0);

const explicitWidth = computed(() => parseSize(props.image.width));
const explicitHeight = computed(() => parseSize(props.image.height));

const containerStyle = computed(() => ({
  width: explicitWidth.value ?? "100%",
  height: explicitHeight.value ?? "auto",
}));

function syncImageElementState() {
  if (!props.image.src) {
    state.value = "error";
    return;
  }
  const el = imgRef.value;
  if (!el || !el.complete) return;
  // Per HTML spec, complete === true on non-empty src means either decoded (> 0) or broken (0)
  state.value = el.naturalWidth > 0 ? "loaded" : "error";
}

function handleLoad() {
  state.value = "loaded";
}

function handleError() {
  state.value = "error";
}

function handleRetry(event: MouseEvent) {
  event.stopPropagation();
  if (!props.image.src) return;
  retryKey.value += 1;
  state.value = "loading";
  nextTick(syncImageElementState);
}

function handleClick() {
  if (!props.previewable || state.value !== "loaded") return;
  if (gallery && gallery.images.value.length > 0) {
    store.openImagePreview(gallery.images.value, props.galleryIndex ?? 0);
  } else {
    store.openImagePreview(props.image, 0);
  }
}

watch(
  () => props.image.src,
  newSrc => {
    retryKey.value = 0;
    state.value = newSrc ? "loading" : "error";
    if (newSrc) {
      nextTick(syncImageElementState);
    }
  }
);

onMounted(() => {
  syncImageElementState();
});
</script>

<template>
  <!-- Use phrasing <span> tags only so SSR inside markdown <p> never triggers HTML parser split -->
  <span
    class="elysium-ui elysium-ui__image"
    :class="{
      'elysium-ui__image--loading': state === 'loading',
      'elysium-ui__image--loaded': state === 'loaded',
      'elysium-ui__image--error': state === 'error',
      'elysium-ui__image--previewable': props.previewable,
      'elysium-ui__image--auto-height': !explicitHeight,
    }"
    :style="containerStyle"
    @click="handleClick"
  >
    <img
      v-if="state !== 'error'"
      :key="retryKey"
      ref="imgRef"
      class="elysium-ui__image-el"
      :src="props.image.src"
      :alt="props.image.alt"
      :loading="props.lazy ? 'lazy' : 'eager'"
      decoding="async"
      @load="handleLoad"
      @error="handleError"
    />

    <span
      v-if="state === 'loading'"
      aria-hidden="true"
      class="elysium-ui__image-skeleton"
    >
      <span class="elysium-ui__image-skeleton-wash" />
      <ElySpinner :size="22" />
    </span>

    <span
      v-else-if="state === 'error'"
      role="img"
      :aria-label="
        props.image.alt ? `图片加载失败：${props.image.alt}` : '图片加载失败'
      "
      class="elysium-ui__image-fallback select-none"
    >
      <ImageOff
        :size="20"
        :stroke-width="1.5"
        class="elysium-ui__image-fallback-icon"
      />
      <span class="elysium-ui__image-fallback-text">图片加载失败</span>
      <ElyButton secondary size="small" @click="handleRetry">
        <RotateCw :size="12" :stroke-width="1.5" />
        <span>重试</span>
      </ElyButton>
    </span>
  </span>
</template>

<style scoped lang="scss">
.elysium-ui__image {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  min-width: 0;
  max-width: min(100%, 48rem);
  box-sizing: border-box;
  border-radius: 0;
  border: 1px solid var(--color-accent-border-200);
  background-color: var(--gouache-paper);
  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease;

  &--auto-height.elysium-ui__image--loading,
  &--auto-height.elysium-ui__image--error {
    min-height: 168px;
  }

  &--previewable.elysium-ui__image--loaded {
    cursor: zoom-in;

    &:hover {
      border-color: var(--color-accent-border-500);
      box-shadow: 4px 4px 0 0 var(--gouache-wash);
    }
  }

  &--error {
    border-style: dashed;
    border-color: var(--color-accent-border-300);
    background-color: color-mix(
      in srgb,
      var(--gouache-card) 75%,
      var(--gouache-paper)
    );
  }
}

.elysium-ui__image-el {
  display: block;
  margin: 0;
  width: 100%;
  min-width: 0;
  height: auto;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;

  .elysium-ui__image--loaded & {
    opacity: 1;
  }
}

.elysium-ui__image-skeleton {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: color-mix(
    in srgb,
    var(--gouache-card) 78%,
    var(--gouache-paper)
  );
  overflow: hidden;
  pointer-events: none;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 10px;
    height: 10px;
    border-color: var(--color-accent-border-400);
    border-style: solid;
  }

  &::before {
    top: 8px;
    left: 8px;
    border-width: 1px 0 0 1px;
  }

  &::after {
    right: 8px;
    bottom: 8px;
    border-width: 0 1px 1px 0;
  }
}

.elysium-ui__image-skeleton-wash {
  position: absolute;
  inset: 0;
  background-color: var(--gouache-wash);
  opacity: 0.32;
  animation: ely-skeleton-breathe 2.2s ease-in-out infinite;
}

.elysium-ui__image-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 20px 12px;
  text-align: center;
  font-family: var(--font-family-base);

  &-icon {
    color: var(--color-accent-text-tertiary);
  }

  &-text {
    font-size: 12px;
    line-height: 1.4;
    color: var(--color-accent-text-tertiary);
  }
}

@keyframes ely-skeleton-breathe {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.58;
  }
}

@media (prefers-reduced-motion: reduce) {
  .elysium-ui__image,
  .elysium-ui__image-el {
    transition: none !important;
  }

  .elysium-ui__image-skeleton-wash {
    animation: none !important;
  }
}
</style>
