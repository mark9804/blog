<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string;
  }>(),
  {
    name: "",
  }
);
</script>

<template>
  <a-image-preview-group infinite>
    <a-space>
      <slot />
    </a-space>
  </a-image-preview-group>
  <figcaption
    v-if="name.length > 0"
    class="text-sm text-[var(--color-text-3)] text-center"
  >
    {{ name }}
  </figcaption>
</template>
