<script setup lang="ts">
import { computed, inject } from "vue";
import type { ImageProps } from "./types/ImageProps";
import { GALLERY_INJECTION_KEY } from "./types/GalleryContext";
import { useImageStore } from "../../../stores/imageStore";
import { parseSize } from "./_utils/styleUtils";

const props = defineProps<ImageProps>();

const store = useImageStore();
const gallery = inject(GALLERY_INJECTION_KEY, null);

const imageStyle = computed(() => ({
  width: parseSize(props.image.width) ?? "100%",
  height: parseSize(props.image.height) ?? "auto",
}));

function handleClick() {
  if (gallery && gallery.images.value.length > 0) {
    store.openImagePreview(gallery.images.value, props.galleryIndex ?? 0);
  } else {
    store.openImagePreview(props.image, 0);
  }
}
</script>

<template>
  <img
    class="elysium-ui elysium-ui__image cursor-pointer w-full max-w-screen-md flex-1 block object-cover"
    :src="props.image.src"
    :alt="props.image.alt"
    :style="imageStyle"
    :loading="props.lazy ? 'lazy' : undefined"
    @click="handleClick"
  />
</template>

<style scoped lang="scss">
img.elysium-ui__image {
  min-width: 0;
  max-width: 100%;
}
</style>
