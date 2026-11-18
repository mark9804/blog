<script lang="ts" setup>
import type { ToasterProps } from "vue-sonner";
import { Check, Info, OctagonX, TriangleAlert, X as Close } from "@lucide/vue";
import { Toaster } from "vue-sonner";
import { useData } from "vitepress";
import ElySpinner from "./ElySpinner.vue";

const props = withDefaults(defineProps<ToasterProps>(), {
  position: "top-center",
});

const { isDark } = useData();
</script>

<template>
  <Toaster
    v-bind="props"
    class="elysium-ui__toast-message"
    :theme="isDark ? 'dark' : 'light'"
  >
    <template #success-icon>
      <Check :size="13" :stroke-width="1.8" />
    </template>
    <template #info-icon>
      <Info :size="13" :stroke-width="1.6" />
    </template>
    <template #warning-icon>
      <TriangleAlert :size="13" :stroke-width="1.6" />
    </template>
    <template #error-icon>
      <OctagonX :size="13" :stroke-width="1.6" />
    </template>
    <template #loading-icon>
      <ElySpinner :size="14" />
    </template>
    <template #close-icon>
      <Close :size="12" :stroke-width="1.75" />
    </template>
  </Toaster>
</template>

<style lang="scss">
[data-sonner-toaster].elysium-ui__toast-message {
  --border-radius: 0px;
  --normal-bg: var(--gouache-paper);
  --normal-border: var(--color-accent-border-300);
  --normal-text: var(--gouache-ink);
  font-family: var(--font-family-base);

  [data-sonner-toast][data-styled="true"] {
    padding: 10px 14px;
    gap: 10px;
    border-radius: 0 !important;
    background-color: var(--gouache-paper) !important;
    border: 1px solid var(--color-accent-border-300) !important;
    color: var(--gouache-ink) !important;
    box-shadow: 4px 4px 0 0
      color-mix(in srgb, var(--gouache-wash) 78%, var(--gouache-paper)) !important;

    // Top-left overhanging registration crosshair (attached to [data-content] so
    // vue-sonner's own [data-sonner-toast]::before/::after swipe & gap layers stay intact)
    > [data-content] {
      flex: 1;
      min-width: 0;

      &::before,
      &::after {
        content: "";
        position: absolute;
        background-color: var(--color-accent-border-500);
        pointer-events: none;
      }

      &::before {
        top: -1px;
        left: -6px;
        width: 14px;
        height: 1px;
      }

      &::after {
        top: -6px;
        left: -1px;
        width: 1px;
        height: 14px;
      }
    }

    [data-icon] {
      width: 20px;
      height: 20px;
      margin: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background-color: var(--gouache-wash);
      border: 1px solid var(--color-accent-border-200);
      color: var(--color-accent);

      svg {
        margin: 0 !important;
      }
    }

    &[data-type="loading"] [data-icon] {
      background-color: transparent;
      border: none;
    }

    &[data-type="warning"] [data-icon] {
      color: #9a6700;
      border-color: rgba(154, 103, 0, 0.35);
      background-color: rgba(154, 103, 0, 0.08);
    }

    &[data-type="error"] [data-icon] {
      color: #c44343;
      border-color: rgba(196, 67, 67, 0.35);
      background-color: rgba(196, 67, 67, 0.08);
    }

    [data-title] {
      font-size: 13px;
      font-weight: 500;
      line-height: 1.45;
      color: var(--gouache-ink);
      white-space: nowrap;
    }

    [data-description] {
      font-size: 12px;
      line-height: 1.45;
      color: var(--color-accent-text-secondary);
    }

    [data-close-button] {
      border-radius: 0;
      background-color: var(--gouache-paper);
      border: 1px solid var(--color-accent-border-300);
      color: var(--color-accent-text-secondary);

      &:hover {
        background-color: var(--gouache-wash);
        color: var(--gouache-ink);
      }
    }

    [data-button] {
      border-radius: 0;
      background-color: var(--gouache-ink);
      color: var(--gouache-paper);
    }
  }

  // Single-line ledger layout for toasts carrying an inline code preview chip
  .ely-toast__inline-content {
    flex-direction: row !important;
    align-items: center;
    justify-content: space-between;
    gap: 10px !important;
  }

  .ely-toast__code-chip {
    max-width: 215px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 1px 7px;
    font-family: var(--font-family-mono);
    font-size: 11.5px;
    line-height: 1.5;
    color: var(--color-accent-code) !important;
    background-color: color-mix(
      in srgb,
      var(--gouache-wash) 45%,
      var(--gouache-paper)
    );
    border: 1px solid var(--color-accent-border-200);
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-sonner-toaster].elysium-ui__toast-message,
  [data-sonner-toaster].elysium-ui__toast-message [data-sonner-toast] {
    transition: none !important;
  }
}
</style>
