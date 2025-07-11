<script setup lang="ts">
import type { SpaceProps } from "./types/SpaceProps";
import { computed, useSlots } from "vue";
import { getAllElements } from "./_utils/vueUtils";
import { parseSize } from "./_utils/styleUtils";
const props = withDefaults(defineProps<SpaceProps>(), {
  align: "start",
  direction: "horizontal",
  size: "medium",
  wrap: false,
});

const sizeMap = {
  mini: 4,
  small: 8,
  medium: 16,
  large: 32,
};

const DEFAULT_SIZE = 16;

const spaceSize = computed(() => {
  if (typeof props.size === "number") {
    return props.size + "px";
  }

  if (!(props.size in sizeMap)) {
    console.warn(
      `ElySpace: Invalid size prop: "${props.size}". Falling back to default size.`
    );
    return DEFAULT_SIZE + "px";
  }

  return sizeMap[props.size as keyof typeof sizeMap] + "px";
});

function getMarginOrPaddingSize(
  size: SpaceProps["margin"] | SpaceProps["padding"]
) {
  if (!size) return null;
  if (typeof size === "string") {
    return parseSize(size);
  }

  if (typeof size === "number") {
    return size + "px";
  }

  if (Array.isArray(size)) {
    return size.map(size => parseSize(size)).join(" ");
  }
}

const marginSize = computed(() => {
  return getMarginOrPaddingSize(props.margin);
});

const paddingSize = computed(() => {
  return getMarginOrPaddingSize(props.padding);
});

const spaceClass = computed(() => {
  return [
    {
      "flex-col": props.direction === "vertical" || props.vertical,
      "flex-wrap": props.wrap,
      "items-stretch": props.align === "stretch",
      "items-center": props.align === "center",
      "items-end": props.align === "end",
      "items-start": props.align === "start",
      "items-baseline": props.align === "baseline",
      "w-full": !!props.wide,
    },
  ];
});

const spaceStyles = computed(() => {
  const styles: Record<string, string | undefined> = {
    gap: spaceSize.value,
  };

  const margin = marginSize.value;
  const padding = paddingSize.value;

  if (margin) styles.margin = margin;
  if (padding) styles.padding = padding;

  return styles;
});

const slots = useSlots() as {
  default?: () => any[];
  divider?: () => any;
};

const children = computed(() => getAllElements(slots.default?.(), true));
</script>

<template>
  <div
    class="elysium-ui elysium-ui__space flex"
    :class="spaceClass"
    :style="spaceStyles"
  >
    <template
      v-for="(child, index) in children"
      :key="child.key ?? `item-${index}`"
    >
      <template v-if="!!(slots.divider || props.divider) && index > 0">
        <span
          v-if="!!props.divider"
          role="separator"
          aria-label="分隔符"
          class="elysium-ui elysium-ui__space--built-in-divider select-none"
        >
          {{ props.divider }}
        </span>
        <slot v-else name="divider" />
      </template>
      <component :is="child" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use "../../styles/colors";
.elysium-ui__space--built-in-divider {
  display: inline-block;
  color: colors.$color-accent-text-secondary;
}
</style>
