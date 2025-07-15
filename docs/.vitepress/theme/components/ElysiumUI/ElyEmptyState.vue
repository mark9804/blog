<script setup lang="ts">
import ElyIconEmpty from "./ElyIcon/ElyIconEmpty.vue";
</script>

<template>
  <div class="ely-empty-state flex flex-col items-center justify-center gap-4">
    <ElyIconEmpty size="100" color="var(--color-accent-text-tertiary)" />
    <p class="text-sm text-tertiary ellipsis-followed">
      你似乎来到了篇章的尾声
    </p>
  </div>
</template>

<style scoped lang="scss">
.ellipsis-followed::after {
  content: "……";
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
}
</style>
