<script setup lang="ts">
import { useTemplateRef } from "vue";
import { useSwipe } from "@vueuse/core";
withDefaults(
  defineProps<{
    name: string;
    length: number;
  }>(),
  {
    name: "",
    length: 0,
  }
);

const current = defineModel<number>();
const el = useTemplateRef<HTMLDivElement>("imagePreviewGroup");
const { direction } = useSwipe(el, {
  onSwipeEnd: () => {
    if (direction.value === "left") {
      current.value = (current.value + 1) % length;
    } else if (direction.value === "right") {
      current.value = (current.value - 1 + length) % length;
    }
  },
});
</script>

<template>
  <ClientOnly>
    <a-image-preview-group v-model:current="current" ref="imagePreviewGroup">
      <a-space>
        <slot />
      </a-space>
    </a-image-preview-group>
  </ClientOnly>
  <figcaption
    v-if="name.length > 0"
    class="text-sm text-[var(--color-text-3)] text-center mt-2"
  >
    {{ name }}
  </figcaption>
</template>
