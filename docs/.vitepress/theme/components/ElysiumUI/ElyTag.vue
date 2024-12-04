<script setup lang="ts">
import type { TagProps } from "./types/TagProps";
import { computed, ref, watch } from "vue";

const props = withDefaults(defineProps<TagProps>(), {
  id: undefined,
  size: "medium",
  primary: true,
  secondary: false,
  active: false,
  clickable: false,
  closable: false,
  disabled: false,
});

const emit = defineEmits<{
  (e: "close", id: string): void;
  (e: "click", id: string): void;
}>();

const isActive = ref(props.active);

watch(
  () => props.active,
  val => {
    isActive.value = val;
  }
);

const classes = computed(() => ({
  "elysium-ui__tag": true,
  "elysium-ui__tag--primary": props.primary,
  "elysium-ui__tag--secondary": props.secondary,
  "elysium-ui__tag--mini": props.size === "mini",
  "elysium-ui__tag--small": props.size === "small",
  "elysium-ui__tag--medium": props.size === "medium",
  "elysium-ui__tag--large": props.size === "large",
  "elysium-ui__tag--active": isActive.value,
  "elysium-ui__tag--clickable": props.clickable,
  "elysium-ui__tag--disabled": props.disabled,
  "select-none": true,
}));

const handleClick = () => {
  if (!props.disabled && props.clickable) {
    isActive.value = !isActive.value;
    emit("click", props.id);
  }
};

const handleClose = (e: Event) => {
  e.stopPropagation();
  if (!props.disabled) {
    emit("close", props.id);
  }
};
</script>

<template>
  <span
    :class="classes"
    :role="props.clickable ? 'button' : null"
    @click="handleClick"
    :tabindex="!props.disabled && props.clickable ? 0 : -1"
    @keydown.space.prevent="handleClick"
    @keydown.enter="handleClick"
  >
    <span class="elysium-ui__tag--icon">
      <slot name="icon">
        <icon-tag />
      </slot>
    </span>
    <span class="elysium-ui__tag--content font-bold">
      <slot></slot>
    </span>
    <span
      v-if="closable"
      class="elysium-ui__tag--close"
      @click="handleClose"
      role="button"
      aria-label="移除标签"
    >
      <icon-close />
    </span>
  </span>
</template>

<style scoped lang="scss">
@use "sass:map";
@use "./_mixins/tag";
@use "../../styles/colors";

.elysium-ui__tag {
  @include tag.tag-base;

  // Size variants
  &--mini {
    @include tag.tag-size("mini");
  }

  &--small {
    @include tag.tag-size("small");
  }

  &--medium {
    @include tag.tag-size("medium");
  }

  &--large {
    @include tag.tag-size("large");
  }

  // Style variants
  &--primary {
    @include tag.tag-primary;
  }

  &--secondary {
    @include tag.tag-secondary;
  }

  // States
  &--active {
    background-color: colors.$color-accent;
    color: colors.$color-accent-base;
  }

  &--clickable {
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  // Icon
  &--icon {
    display: inline-flex;
    align-items: center;
    margin-right: 4px;
    font-size: 0.9em;
  }

  // Close button
  &--close {
    margin-left: 4px;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    font-size: 0.9em;

    &:hover {
      opacity: 0.8;
    }
  }

  // Content
  &--content {
    display: inline-flex;
    align-items: center;
  }
}
</style>
