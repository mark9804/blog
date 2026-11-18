<script setup lang="ts">
import ElyIconBlackHole from "./ElyIcon/ElyIconBlackHole.vue";
</script>

<template>
  <div class="ely-empty-state flex flex-col items-center justify-center gap-4">
    <ElyIconBlackHole :size="96" class="elysium-ui__empty-state__icon" />
    <p class="text-sm text-tertiary m-0">你似乎来到了一片空白宇宙……</p>
  </div>
</template>

<style scoped lang="scss">
.elysium-ui__empty-state__icon {
  color: var(--color-accent-text-tertiary);
}
</style>
