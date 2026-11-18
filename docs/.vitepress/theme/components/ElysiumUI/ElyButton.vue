<script setup lang="ts">
import { computed } from "vue";
import type { ButtonProps } from "./types/ButtonProps";

const props = withDefaults(defineProps<ButtonProps>(), {
  size: "medium",
  secondary: false,
  active: false,
  disabled: false,
});

const emit = defineEmits<{
  (event: "click", e: MouseEvent): void;
}>();

const classes = computed(() => ({
  "ely-button--small": props.size === "small",
  "ely-button--medium": props.size === "medium",
  "ely-button--icon": props.size === "icon",
  "ely-button--secondary": props.secondary && !props.active,
  "ely-button--active": props.active,
  "ely-button--disabled": props.disabled,
}));

function handleClick(event: MouseEvent) {
  if (props.disabled) return;
  emit("click", event);
}
</script>

<template>
  <button
    type="button"
    class="ely-button inline-flex items-center justify-center gap-1.5 select-none"
    :class="classes"
    :disabled="props.disabled"
    :aria-label="props.ariaLabel"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.ely-button {
  box-sizing: border-box;
  border-radius: 0;
  border: 1px solid var(--gouache-ink);
  background-color: var(--gouache-ink);
  color: var(--gouache-paper);
  font-family: var(--font-family-base);
  font-weight: 500;
  line-height: 1.2;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  &:not(:disabled):hover {
    background-color: var(--color-accent);
    border-color: var(--color-accent);
    color: var(--gouache-paper);
  }

  &--small {
    padding: 4px 10px;
    font-size: 12px;
  }

  &--medium {
    padding: 8px 16px;
    font-size: 14px;
  }

  &--icon {
    width: 32px;
    height: 32px;
    padding: 0;
    font-size: 13px;
  }

  &--secondary {
    background-color: var(--gouache-wash);
    color: var(--color-accent-text-primary);
    border-color: var(--color-accent-border-200);

    &:not(:disabled):hover {
      background-color: var(--color-accent);
      border-color: var(--color-accent);
      color: var(--gouache-paper);
    }
  }

  &:disabled,
  &--disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ely-button {
    transition: none !important;
  }
}
</style>
