<script setup lang="ts">
import { OnClickOutside } from "@vueuse/components";
import { ref, computed, onUnmounted, watch } from "vue";
import { useImageStore } from "../../../stores/imageStore";

const imageStore = useImageStore();

const shouldShowPreview = computed(() => imageStore.getImagePreviewVisibility);

const imgList = computed(() => imageStore.getImageList);

const shouldShowNav = computed(
  () => Array.isArray(imgList.value) && imgList.value.length > 1
);

const imgIndex = computed(() => imageStore.getImagePreviewIndex ?? 0);

// 配置点击外部的选项，忽略导航和关闭按钮
const clickOutsideOptions = {
  ignore: [".elysium-ui__image-preview__button"],
};

function handlePrev() {
  imageStore.prevImagePreview();
}

function handleNext() {
  imageStore.nextImagePreview();
}

function handleClose() {
  imageStore.closeImagePreview();
}

const scrollDelta = ref(0);
const scale = ref(1);
const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const lastTouchDistance = ref(0);

let rafId: number | null = null; // 节流用

function updateScale(delta: number) {
  if (!!rafId) return;

  rafId = requestAnimationFrame(() => {
    const newScale = scale.value + delta * 0.01;
    scale.value = Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE);
    rafId = null;
  });
}

function handleScroll(event: WheelEvent) {
  // 阻止默认滚动行为，避免 scroll chaining
  event.preventDefault();

  // 只处理 pinch zoom 手势
  //（触摸板上的捏合手势会转换为 ctrl + wheel 事件）
  if (event.ctrlKey) {
    scrollDelta.value = event.deltaY;
    updateScale(-event.deltaY);
  } else {
    // TODO: 平移滚动时平移图片
  }
}

function handleTouch(event: TouchEvent) {
  // 处理单指事件（点击等）
  if (event.touches.length === 1) {
    // TODO: 平移滚动时平移图片
    return;
  }

  // 过滤双指以外的触摸事件
  if (event.touches.length !== 2) return;

  // 获取触摸点
  const touch1 = event.touches[0];
  const touch2 = event.touches[1];

  // 计算两点间距离
  const distance = Math.hypot(
    touch2.clientX - touch1.clientX,
    touch2.clientY - touch1.clientY
  );

  if (event.type === "touchstart") {
    event.preventDefault(); // 仅在开始缩放时阻止默认行为
    lastTouchDistance.value = distance;
    return;
  }

  // 计算距离变化，只有在变化超过阈值时才认为是缩放
  const delta = distance - lastTouchDistance.value;
  if (Math.abs(delta) > 1) {
    // 添加一个小阈值，避免误触
    event.preventDefault();
    updateScale(delta * 0.1);
    lastTouchDistance.value = distance;
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

watch(shouldShowPreview, newVal => {
  if (newVal && imgList.value.length > 1) {
    document.addEventListener("keydown", handleKeydown);
  } else {
    document.removeEventListener("keydown", handleKeydown);
  }
});

onUnmounted(() => {
  if (rafId) {
    cancelAnimationFrame(rafId);
  }
});
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="shouldShowPreview"
          class="elysium-ui elysium-ui__image-preview__container fixed z-999 top-0 left-0 w-full h-full bg-black/40 flex flex-col items-center justify-center gap-4"
          @wheel="handleScroll"
          @touchstart="handleTouch"
          @touchmove="handleTouch"
        >
          <OnClickOutside :options="clickOutsideOptions" @trigger="handleClose">
            <img
              class="elysium-ui__image-preview--image w-full max-w-screen-md object-contain flex-1"
              :src="imgList[imgIndex].src"
              :style="{ transform: `scale(${scale})` }"
              alt="Image preview"
            />
          </OnClickOutside>
          <!-- Switch image -->
          <button
            v-if="shouldShowNav"
            class="elysium-ui__image-preview__button elysium-ui__image-preview__button__nav elysium-ui__image-preview__button__nav--prev"
            @click="handlePrev"
          >
            <IconLeft />
          </button>
          <button
            v-if="shouldShowNav"
            class="elysium-ui__image-preview__button elysium-ui__image-preview__button__nav elysium-ui__image-preview__button__nav--next"
            @click="handleNext"
          >
            <IconRight />
          </button>
          <!-- Close -->
          <button
            class="elysium-ui__image-preview__button elysium-ui__image-preview__button--close"
            @click="handleClose"
            aria-label="关闭图像预览"
          >
            <icon-close />
          </button>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<style lang="scss" scoped>
.elysium-ui__image-preview {
  &__button {
    @apply absolute bg-black/50 text-white/80;

    &__nav {
      @apply top-1/2 rounded-[3px];
      @apply w-10 xs:w-8 h-10 xs:h-8 flex items-center justify-center;
      &--prev {
        @apply left-4;
      }
      &--next {
        @apply right-4;
      }
    }

    &--close {
      @apply top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  @apply transition-opacity duration-300;
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
}
</style>
