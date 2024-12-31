<script setup lang="ts">
import type { ImageProps } from "./types/ImageProps";
import { useImageStore } from "../../../stores/imageStore";
import { parseSize } from "./_utils/styleUtils";
import { computed } from "vue";

const props = defineProps<ImageProps>();

const store = useImageStore();

const imageSrc = computed(() => {
  if (Array.isArray(props.image)) {
    return props.image[(props.index ?? 0) % props.image.length];
  }
  return props.image;
});

function handleClick() {
  store.openImagePreview(props.image, props.index);
}
</script>

<template>
  <img
    class="elysium-ui elysium-ui__image cursor-pointer w-full max-w-screen-md object-contain flex-1 block"
    :src="imageSrc.src"
    :alt="imageSrc.alt"
    @click="handleClick"
    :style="{
      width: parseSize(imageSrc.width) ?? '100%',
      height: parseSize(imageSrc.height) ?? 'auto',
    }"
  />
</template>

<style scoped lang="scss">
img.elysium-ui__image {
  display: block;
  min-width: 0;
  max-width: 100%;
  object-fit: cover;
}
</style>
