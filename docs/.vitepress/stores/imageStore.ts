import { defineStore } from "pinia";
import { ImagePreviewConfig } from "../theme/types/ImagePreviewConfig";
import { ref, computed } from "vue";

export const useImageStore = defineStore("vitepress-image-store", () => {
  const imagePreviewSettings = ref<ImagePreviewConfig>({
    show: false,
    image: "",
    index: 0,
  });
  const getImagePreviewSettings = computed(() => imagePreviewSettings.value);
  const getImagePreviewVisibility = computed(
    () => imagePreviewSettings.value.show
  );
  const getImageList = computed(() => {
    return Array.isArray(imagePreviewSettings.value.image)
      ? imagePreviewSettings.value.image
      : [imagePreviewSettings.value.image];
  });
  const getImagePreviewIndex = computed(() => imagePreviewSettings.value.index);
  function toggleImagePreview() {
    imagePreviewSettings.value.show = !imagePreviewSettings.value.show;
  }
  function closeImagePreview() {
    imagePreviewSettings.value.show = false;
  }
  function openImagePreview(image: string | string[], index?: number) {
    imagePreviewSettings.value.image = image;
    imagePreviewSettings.value.index = index ?? 0;
    imagePreviewSettings.value.show = true;
  }
  function setImagePreviewIndex(index: number) {
    imagePreviewSettings.value.index = index;
  }
  function setImagePreviewSettings(settings: ImagePreviewConfig) {
    imagePreviewSettings.value = settings;
  }

  return {
    imagePreviewSettings,
    getImagePreviewSettings,
    getImagePreviewVisibility,
    getImageList,
    getImagePreviewIndex,
    toggleImagePreview,
    closeImagePreview,
    openImagePreview,
    setImagePreviewIndex,
    setImagePreviewSettings,
  };
});
