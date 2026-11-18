<script setup lang="ts">
import { computed } from "vue";
import { Tag } from "@lucide/vue";
import type { TagProps } from "./types/TagProps";

const props = withDefaults(defineProps<TagProps>(), {
  size: "medium",
  primary: true,
  active: false,
  clickable: false,
});

const emit = defineEmits<{
  (e: "click", event: Event): void;
}>();

const classes = computed(() => ({
  "elysium-ui__tag": true,
  "elysium-ui__tag--primary": props.primary,
  "elysium-ui__tag--small": props.size === "small",
  "elysium-ui__tag--medium": props.size === "medium",
  "elysium-ui__tag--active": props.active,
  "elysium-ui__tag--clickable": props.clickable,
  "select-none": true,
}));

function handleClick(e: Event) {
  if (!props.clickable) return;
  e.stopPropagation();
  e.preventDefault();
  emit("click", e);
}
</script>

<template>
  <span
    :class="classes"
    :role="props.clickable ? 'button' : undefined"
    :tabindex="props.clickable ? 0 : undefined"
    @click="handleClick"
    @keydown.space.prevent="handleClick"
    @keydown.enter="handleClick"
  >
    <span class="elysium-ui__tag--icon">
      <slot name="icon">
        <Tag :size="11" :stroke-width="1.75" />
      </slot>
    </span>
    <span class="elysium-ui__tag--content">
      <slot />
    </span>
  </span>
</template>

<style scoped lang="scss">
.elysium-ui__tag {
  display: inline-flex;
  align-items: center;
  border-radius: 0;
  font-family: var(--font-family-base);
  font-weight: 500;
  cursor: default;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &--small {
    padding: 1px 10px;
    font-size: 12px;
  }

  &--medium {
    padding: 2px 12px;
    font-size: 14px;
  }

  &--primary {
    color: var(--color-accent);
    background-color: var(--gouache-wash);
  }

  &--active {
    background-color: var(--color-accent);
    color: var(--color-accent-base);
  }

  &--clickable {
    cursor: pointer;

    &:hover {
      background-color: var(--color-accent);
      color: var(--color-accent-base);
    }

    &:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 2px;
    }
  }

  &--icon {
    display: inline-flex;
    align-items: center;
    margin-right: 4px;
    font-size: 0.9em;
  }

  &--content {
    display: inline-flex;
    align-items: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .elysium-ui__tag {
    transition: none !important;
  }
}
</style>
