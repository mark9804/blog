<script setup lang="ts">
import { computed, ref, useSlots } from "vue";
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from "reka-ui";
import type { TooltipProps } from "./types/TooltipProps";

const props = withDefaults(defineProps<TooltipProps>(), {
  position: "top",
  sideOffset: 5,
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
          class="ely-tooltip__content max-w-80 rounded-sm px-3 py-[6px] text-sm color-[var(--color-accent-base)] bg-[var(--color-accent-text-primary)]"
          :side="side"
          :align="align"
          :side-offset="sideOffset"
        >
          <slot v-if="slots.content" name="content" />
          <template v-else>{{ content }}</template>
          <TooltipArrow class="ely-tooltip__arrow" :width="8" :height="4" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>

<style lang="scss">
.ely-tooltip__content {
  will-change: transform, opacity;
  z-index: 100;
  transform-origin: var(--reka-tooltip-content-transform-origin);
  animation-duration: 0.175s;
  animation-timing-function: cubic-bezier(0.3, 1.3, 0.3, 1);
  animation-fill-mode: forwards;

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
    transition: opacity 0.1s cubic-bezier(0.3, 1.3, 0.3, 1);
  }
}

// Each direction slides in from the opposite side
@keyframes ely-tooltip-top {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(4px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes ely-tooltip-bottom {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(-4px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes ely-tooltip-left {
  from {
    opacity: 0;
    transform: scale(0.96) translateX(4px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateX(0);
  }
}

@keyframes ely-tooltip-right {
  from {
    opacity: 0;
    transform: scale(0.96) translateX(-4px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateX(0);
  }
}

.ely-tooltip__arrow {
  fill: var(--color-accent-text-primary);
}
</style>
