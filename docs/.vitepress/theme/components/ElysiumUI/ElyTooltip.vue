<script setup lang="ts">
import { computed, ref, useSlots } from "vue";
import {
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from "reka-ui";
import type { TooltipProps } from "./types/TooltipProps";

const props = withDefaults(defineProps<TooltipProps>(), {
  position: "top",
  sideOffset: 8,
  defaultOpen: false,
  open: undefined,
  disableHoverableContent: undefined,
  closeDelay: 0,
});

const slots = useSlots();

// Map position shorthand to reka-ui side + align
const side = computed(() => {
  const map: Record<string, "top" | "right" | "bottom" | "left"> = {
    top: "top",
    bottom: "bottom",
    left: "left",
    right: "right",
    tl: "top",
    tr: "top",
    bl: "bottom",
    br: "bottom",
  };
  return map[props.position] ?? "top";
});

const align = computed(() => {
  const map: Record<string, "start" | "center" | "end"> = {
    tl: "start",
    tr: "end",
    bl: "start",
    br: "end",
  };
  return map[props.position] ?? "center";
});

const _internalOpen = ref(props.defaultOpen);
const isControlled = computed(() => props.open !== undefined);

const isOpen = computed({
  get: () => (isControlled.value ? props.open! : _internalOpen.value),
  set: (val: boolean) => {
    if (!isControlled.value) {
      _internalOpen.value = val;
    }
  },
});

let closeTimer: ReturnType<typeof setTimeout> | null = null;

function handleOpenChange(next: boolean) {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }

  if (next || props.closeDelay <= 0) {
    isOpen.value = next;
  } else {
    closeTimer = setTimeout(() => {
      isOpen.value = false;
      closeTimer = null;
    }, props.closeDelay);
  }
}
</script>

<template>
  <TooltipProvider
    :delay-duration="0"
    :disable-hoverable-content="disableHoverableContent"
  >
    <TooltipRoot
      :default-open="defaultOpen"
      @update:open="handleOpenChange"
      :open="isOpen"
    >
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          class="ely-tooltip__content relative max-w-80 px-2.5 py-1.5 text-xs"
          :side="side"
          :align="align"
          :side-offset="sideOffset"
        >
          <slot v-if="slots.content" name="content" />
          <template v-else>{{ content }}</template>
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>

<style lang="scss">
.ely-tooltip__content {
  z-index: 100;
  font-family: var(--font-family-base);
  line-height: 1.55;
  letter-spacing: 0.01em;
  color: var(--color-accent-text-primary);
  background-color: var(--gouache-paper);
  border: 1px solid var(--color-accent-border-300);
  border-radius: 0;
  box-shadow: 3px 3px 0 0
    color-mix(in srgb, var(--gouache-wash) 78%, var(--gouache-paper));
  will-change: transform, opacity;
  animation-duration: 0.18s;
  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
  animation-fill-mode: forwards;

  // Top-left overhanging registration crosshair matching cards & frontispiece
  &::before,
  &::after {
    content: "";
    position: absolute;
    background-color: var(--color-accent-border-500);
    pointer-events: none;
  }

  &::before {
    top: -1px;
    left: -5px;
    width: 11px;
    height: 1px;
  }

  &::after {
    top: -5px;
    left: -1px;
    width: 1px;
    height: 11px;
  }

  // Clean resets for rich HTML footnote tooltips
  p {
    margin: 0;
  }

  a {
    color: var(--color-accent);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  code {
    font-family: var(--font-family-mono);
    font-size: 0.92em;
    padding: 0 4px;
    background-color: var(--gouache-wash);
    color: var(--color-accent-code);
  }

  &[data-side="top"] {
    animation-name: ely-tooltip-top;
  }
  &[data-side="bottom"] {
    animation-name: ely-tooltip-bottom;
  }
  &[data-side="left"] {
    animation-name: ely-tooltip-left;
  }
  &[data-side="right"] {
    animation-name: ely-tooltip-right;
  }

  &[data-state="closed"] {
    opacity: 0;
    transition: opacity 0.12s ease;
  }
}

@keyframes ely-tooltip-top {
  from {
    opacity: 0;
    transform: translate3d(0, 3px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes ely-tooltip-bottom {
  from {
    opacity: 0;
    transform: translate3d(0, -3px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes ely-tooltip-left {
  from {
    opacity: 0;
    transform: translate3d(3px, 0, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes ely-tooltip-right {
  from {
    opacity: 0;
    transform: translate3d(-3px, 0, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ely-tooltip__content {
    animation: none !important;
    transition: none !important;
  }
}
</style>
