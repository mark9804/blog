<script setup lang="ts">
import type { ImageBase } from "./types/ImageBase";
import { computed } from "vue";
const props = withDefaults(
  defineProps<{
    name: string;
    imgList: ImageBase[];
  }>(),
  {
    name: "",
    imgList: () => [] as ImageBase[],
  }
);

const images = computed(() => {
  const result = Array.from(
    { length: 3 },
    () => [] as Array<ImageBase & { index: number }>
  );
  props.imgList.forEach((img, index) => {
    result[index % 3].push({ ...img, index });
  });
  return result;
});
</script>

<template>
  <ClientOnly>
    <div class="elysium-ui elysium-ui__gallery flex flex-col gap-2 container">
      <div class="elysium-ui elysium-ui__gallery__img-container flex gap-2">
        <ElySpace
          v-for="imageGroup in images"
          size="small"
          direction="vertical"
        >
          <ElyImage
            v-for="img in imageGroup"
            :key="img.index"
            :image="props.imgList"
            :index="img.index"
            lazy
          />
        </ElySpace>
      </div>
      <figcaption
        v-if="name.length > 0"
        class="text-sm text-[var(--color-text-3)] text-center mt-2"
      >
        {{ name }}
      </figcaption>
    </div>
  </ClientOnly>
</template>

<style scoped lang="scss">
.elysium-ui__gallery {
  container-type: inline-size;

  @container (max-width: 375px) {
    &__img-container {
      flex-direction: column;
    }
  }
}
</style>
