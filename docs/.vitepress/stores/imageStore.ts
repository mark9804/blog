import { defineStore } from "pinia";
import { ref } from "vue";
import type { ImageBase } from "../theme/components/ElysiumUI/types/ImageBase";

export const useImageStore = defineStore("vitepress-image-store", () => {
  const visible = ref(false);
  const images = ref<ImageBase[]>([]);
  const index = ref(0);

  function openImagePreview(
    input: ImageBase | ImageBase[],
    startIndex = 0
  ): void {
    const normalized = Array.isArray(input) ? input : [input];
    if (normalized.length === 0) return;

    images.value = normalized;
    index.value = Math.min(Math.max(0, startIndex), normalized.length - 1);
    visible.value = true;
  }

  function closeImagePreview(): void {
    visible.value = false;
  }

  function prevImagePreview(): void {
    index.value = Math.max(0, index.value - 1);
  }

  function nextImagePreview(): void {
    if (images.value.length === 0) return;
    index.value = Math.min(images.value.length - 1, index.value + 1);
  }

  return {
    visible,
    images,
    index,
    openImagePreview,
    closeImagePreview,
    prevImagePreview,
    nextImagePreview,
  };
});
