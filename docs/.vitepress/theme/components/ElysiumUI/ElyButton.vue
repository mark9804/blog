<script setup lang="ts">
import { computed } from "vue";
import type { ButtonProps } from "./types/ButtonProps";

const props = withDefaults(defineProps<ButtonProps>(), {
  as: "button",
  size: "medium",
  active: false,
  disabled: false,
  bordered: false,
  wide: false,
  loading: false,
  primary: true,
  secondary: false,
  text: false,
});

const classes = computed(() => ({
  "ely-button": true,
  "ely-button--primary": props.primary,
  "ely-button--secondary": props.secondary,
  "ely-button--text": props.text,
  "ely-button--mini": props.size === "mini",
  "ely-button--small": props.size === "small",
  "ely-button--medium": props.size === "medium",
  "ely-button--large": props.size === "large",
  "ely-button--bordered": props.bordered,
  "ely-button--wide": props.wide,
  "ely-button--active": props.active,
  "ely-button--disabled": props.disabled,
  "ely-button--loading": props.loading,
}));

const emit = defineEmits<{
  (event: "click", e: MouseEvent): void;
}>();

function handleClick(event: MouseEvent) {
  if (props.disabled) return;
  emit("click", event);
}

const isLink = computed(() => props.as === "link");
const buttonTag = computed(() => (isLink.value ? "a" : "button"));
</script>

<template>
  <component
    :is="buttonTag"
    :class="classes"
    class="select-none"
    :disabled="disabled"
    :href="isLink ? props.href : null"
    @click="handleClick"
    tabindex="0"
  >
    <span v-if="loading" class="ely-button__loading">
      <span class="loading-spinner"></span>
    </span>
    <span class="ely-button__content font-bold">
      <slot></slot>
    </span>
  </component>
</template>

<style lang="scss" scoped>
@use "./_mixins/button.scss" as button;
@use "./_config/theme_colors" as colors;

.ely-button {
  @include button.button-base;

  &:focus,
  &:focus-visible {
    outline: 2px solid blueviolet;
  }

  // Size variants
  &--mini {
    @include button.button-size("mini");
  }

  &--small {
    @include button.button-size("small");
  }

  &--medium {
    @include button.button-size("medium");
  }

  &--large {
    @include button.button-size("large");
  }

  // Style variants
  &--primary {
    @include button.button-variant("primary");
  }

  &--secondary {
    @include button.button-variant("secondary");
  }

  &--text {
    background-color: transparent;
    color: var(--color-accent);

    &:hover {
      background-color: var(--color-accent-quaternary);
    }
  }

  // Modifiers
  &--bordered {
    border: 1px solid currentColor;
  }

  &--wide {
    width: 100%;
  }

  &--disabled {
    opacity: colors.$disabled-opacity;
    cursor: not-allowed;
    pointer-events: none;
  }

  // Loading state
  &--loading {
    cursor: wait;
    .ely-button__content {
      opacity: colors.$disabled-opacity;
    }
  }

  .loading-spinner {
    @include button.loading-spinner;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
