<template>
  <span
    class="elysium-ui elysium-ui__spinner elysium-ui__spinner--base items-center justify-center border-none rounded-full grid place-items-stretch"
  >
    <span
      class="elysium-ui elysium-ui__spinner--composer elysium-ui__spinner--composer-secondary flex items-center justify-center rounded-full"
    ></span>
    <span
      class="elysium-ui elysium-ui__spinner--composer elysium-ui__spinner--composer-primary flex items-center justify-center rounded-full"
    ></span>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    size: string | number;
    strokeWidth: string | number;
  }>(),
  {
    size: "16",
    strokeWidth: "2",
  }
);

const spinnerSize = computed(() => `${props.size}px`);

const strokeWidth = computed(() => {
  return `${props.strokeWidth}px`;
});
</script>

<style scoped lang="scss">
@use "../../styles/colors.scss" as *;

.elysium-ui__spinner {
  margin: 4px;
  grid-template-areas: "spinner";
  --ely-spinner-stroke-width: v-bind("strokeWidth");
  --ely-spinner-size: v-bind("spinnerSize");
  width: var(--ely-spinner-size);
  height: var(--ely-spinner-size);

  &--composer {
    grid-area: spinner;

    &-primary,
    &-secondary {
      width: var(--ely-spinner-size);
      height: var(--ely-spinner-size);
    }

    &-secondary {
      animation: rotate 1.25s linear infinite;
      mask-image: conic-gradient(#000 0deg, #000 135deg, transparent 135.2deg);
      box-shadow: inset 0 0 0 var(--ely-spinner-stroke-width)
        $color-accent-tertiary;
    }

    &-primary {
      animation: rotate 2s linear infinite;
      mask-image: conic-gradient(#000 0deg, #000 235deg, transparent 235.2deg);
      box-shadow: inset 0 0 0 var(--ely-spinner-stroke-width) $color-accent;
    }
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
