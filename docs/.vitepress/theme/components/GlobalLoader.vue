<template>
  <div class="global-loader">
    <div class="flex flex-col items-center justify-center">
      <ElySpinner size="48" strokeWidth="4" />
      <span class="text-secondary">Loading...</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../styles/colors.scss" as *;

.global-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  width: 100dvw;
  height: 100vh;
  height: 100dvh;
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $color-accent-transparent;
  backdrop-filter: blur(4px);
}

:global(.dark) .global-loader {
  background-color: rgba(0, 0, 0, 0.6);
}
</style>
