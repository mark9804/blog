<script setup lang="ts">
import type { ImageProps } from "./types/ImageProps";
import { GALLERY_INJECTION_KEY } from "./types/GalleryContext";
import { useImageStore } from "../../../stores/imageStore";
import { parseSize } from "./_utils/styleUtils";
import { computed, inject, onMounted, ref } from "vue";

const props = defineProps<ImageProps>();

const store = useImageStore();
const gallery = inject(GALLERY_INJECTION_KEY, null);

// Index of this image within a gallery (if inside one)
const galleryIndex = ref(0);

onMounted(() => {
  if (gallery) {
    const img = Array.isArray(props.image) ? props.image[0] : props.image;
    galleryIndex.value = gallery.registerImage(img);
  }
});

const imageSrc = computed(() => {
  if (Array.isArray(props.image)) {
    return props.image[(props.index ?? 0) % props.image.length];
  }
  return props.image;
});

function handleClick() {
  if (gallery) {
    // Open preview scoped to this gallery's image list
    store.openImagePreview(gallery.images, galleryIndex.value);
  } else {
    store.openImagePreview(props.image, props.index);
  }
}
</script>

<template>
  <img
    class="elysium-ui elysium-ui__image cursor-pointer w-full max-w-screen-md object-fit flex-1 block object-cover"
    :src="imageSrc.src"
    :alt="imageSrc.alt"
    @click="handleClick"
    :style="{
      width: parseSize(imageSrc.width) ?? '100%',
      height: parseSize(imageSrc.height) ?? 'auto',
    }"
    :loading="lazy ? 'lazy' : undefined"
  />
</template>

<style scoped lang="scss">
img.elysium-ui__image {
  min-width: 0;
  max-width: 100%;
}
</style>
