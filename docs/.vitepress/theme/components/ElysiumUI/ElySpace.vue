<script setup lang="ts">
import {
  Comment,
  Fragment,
  Text,
  computed,
  useSlots,
  type VNode,
  type VNodeArrayChildren,
} from "vue";
import type { SpaceProps } from "./types/SpaceProps";

const props = withDefaults(defineProps<SpaceProps>(), {
  align: "start",
  direction: "horizontal",
  size: "medium",
  wrap: false,
});

const SIZE_MAP = {
  mini: 4,
  small: 8,
  medium: 16,
  large: 32,
} as const;

const ALIGN_CLASS: Record<NonNullable<SpaceProps["align"]>, string> = {
  start: "items-start",
  end: "items-end",
  center: "items-center",
  baseline: "items-baseline",
  stretch: "items-stretch",
};

const JUSTIFY_CLASS: Record<NonNullable<SpaceProps["justify"]>, string> = {
  start: "justify-start",
  end: "justify-end",
  center: "justify-center",
  between: "justify-between",
};

const spaceSize = computed(() =>
  typeof props.size === "number"
    ? `${props.size}px`
    : `${SIZE_MAP[props.size] ?? 16}px`
);

const spaceClass = computed(() => [
  ALIGN_CLASS[props.align],
  props.justify ? JUSTIFY_CLASS[props.justify] : undefined,
  {
    "flex-col": props.direction === "vertical" || props.vertical,
    "flex-wrap": props.wrap,
    "w-full": Boolean(props.wide),
  },
]);

const slots = useSlots();
const hasDivider = computed(() => Boolean(props.divider || slots.divider));

function flattenSlotNodes(nodes: VNodeArrayChildren | undefined): VNode[] {
  if (!nodes) return [];
  const result: VNode[] = [];
  for (const node of nodes) {
    if (Array.isArray(node)) {
      result.push(...flattenSlotNodes(node));
      continue;
    }
    if (typeof node !== "object" || node === null) continue;
    if (node.type === Comment) continue;
    if (
      node.type === Text &&
      typeof node.children === "string" &&
      node.children.trim() === ""
    ) {
      continue;
    }
    if (node.type === Fragment && Array.isArray(node.children)) {
      result.push(...flattenSlotNodes(node.children));
    } else {
      result.push(node);
    }
  }
  return result;
}

const children = computed(() =>
  hasDivider.value ? flattenSlotNodes(slots.default?.()) : []
);
</script>

<template>
  <div
    class="elysium-ui elysium-ui__space flex"
    :class="spaceClass"
    :style="{ gap: spaceSize }"
  >
    <slot v-if="!hasDivider" />
    <template v-else>
      <template
        v-for="(child, index) in children"
        :key="child.key ?? `item-${index}`"
      >
        <template v-if="index > 0">
          <span
            v-if="props.divider"
            role="separator"
            aria-label="分隔符"
            class="elysium-ui elysium-ui__space--built-in-divider inline-block select-none"
          >
            {{ props.divider }}
          </span>
          <slot v-else name="divider" />
        </template>
        <component :is="child" />
      </template>
    </template>
  </div>
</template>
