<script setup lang="ts">
import { useImageStore } from "../../../stores/imageStore";
import { parseSize } from "./_utils/styleUtils";
import { computed } from "vue";

const props = defineProps<{
  src: string | string[];
  alt: string;
  index?: number;
  width?: number | string;
  height?: number | string;
}>();

const store = useImageStore();

const imageSrc = computed(() => {
  if (Array.isArray(props.src)) {
    return props.src[props.index ?? 0];
  }
  return props.src;
});

function handleClick() {
  store.openImagePreview(props.src, props.index);
}
</script>

<template>
  <img
    class="elysium-ui elysium-ui__image cursor-pointer w-full max-w-screen-md object-contain flex-1 block"
    :src="imageSrc"
    :alt="props.alt"
    @click="handleClick"
    :style="{
      width: parseSize(props.width) ?? '100%',
      height: parseSize(props.height) ?? '100%',
    }"
  />
</template>

<style scoped lang="scss">
img.elysium-ui__image {
  display: block;
  flex: 1;
  min-width: 0;
  max-width: 100%;
}
</style>
