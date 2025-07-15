<script setup lang="ts">
import ElyIconBlackHole from "./ElyIcon/ElyIconBlackHole.vue";
</script>

<template>
  <div class="ely-empty-state flex flex-col items-center justify-center gap-4">
    <ElyIconBlackHole size="100" color="var(--color-accent-text-tertiary)" />
    <p class="text-sm text-tertiary ellipsis-followed">
      你似乎来到了一片空白宇宙
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
