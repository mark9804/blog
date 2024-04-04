<script setup lang="ts">
withDefaults(
  defineProps<{
    tag?: boolean;
    series?: boolean;
    defaultPrefix?: boolean;
  }>(),
  {
    tag: true,
    series: false,
    defaultPrefix: true,
  }
);
</script>

<template>
  <span
    :class="[
      'span-tag',
      { 'span-series': series, 'with-default-prefix': !!defaultPrefix },
    ]"
  >
    <slot name="default"></slot>
  </span>
</template>

<style scoped lang="scss">
.span-series,
.span-tag {
  font-size: 14px;
  line-height: 1.2;
  color: var(--color-text-3);
  background-color: var(--color-bg-2);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  color: var(--vp-c-brand-1);
  background-color: var(--arona-blue-1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  border-radius: 0.25rem;
  pointer-events: auto;
}

.with-default-prefix::before {
  font-family: "Material Symbols Outlined";
}

.with-default-prefix.span-tag::before {
  content: "\f05b";
}

.with-default-prefix.span-series::before {
  content: "\e865";
}
</style>
