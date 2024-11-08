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
  <ClientOnly>
    <a-image-preview-group>
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
