<template>
  <span
    class="eden-ui eden-ui__input eden-ui__input--wrapper rounded flex gap-1 overflow-clip"
  >
    <input
      type="text"
      class="eden-ui eden-ui__input--input flex flex-1 items-end"
      placeholder="测试输入框"
    />
  </span>
</template>

<style scoped lang="scss">
.eden-ui__input {
  $border-width: 1px;

  &--wrapper {
    will-change: background-color, box-shadow;
    border-bottom: none;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 14px;
    line-height: 22px;
    box-shadow: inset 0 0 0 1px transparent;
    position: relative; // stacking context

    &::before,
    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: $border-width;
      background: #c0c0c0;
      transition: all 0.3s ease-in-out;
    }

    &::after {
      will-change: transform;
      height: 2 * $border-width;
      background: #2773e1;
      transform: rotate3d(0, 1, 0, 90deg);
    }

    &:hover,
    &:focus,
    &:focus-within {
      transition: box-shadow 0.3s ease-in-out;
      box-shadow: inset 0 0 0 1px #c0c0c0;
    }

    &:focus,
    &:focus-within {
      background-color: transparent;

      &::after {
        transform: rotate3d(0, 1, 0, 0deg);
      }
    }
  }
}
</style>
