<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from "radix-vue";
import { computed } from "vue";
const props = withDefaults(defineProps<{ checked: boolean }>(), { checked: false });
const emit = defineEmits(["update:checked"]);
const isChecked = computed({
  get: () => props.checked,
  set: (value: boolean) => emit("update:checked", value),
});
</script>

<template>
  <SwitchRoot class="arona-button" v-model:checked="isChecked">
    <SwitchThumb class="arona-button--thumb" />
  </SwitchRoot>
</template>

<style lang="scss">
$transition: all 0.175s cubic-bezier(0.65, 0.05, 0.36, 1);
.arona-button {
  width: 3rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  background-color: var(--color-fill-3);
  border-radius: 9999px;
  position: relative;
  transition: $transition;

  &[data-state="checked"] {
    background-color: var(--arona-blue-7);

    &:hover {
      background-color: var(--arona-blue-7);
    }
  }

  &:hover {
    background-color: var(--arona-blue-5);
  }
}

.arona-button--thumb {
  width: 1.25rem;
  height: 1.25rem;
  background-color: var(--color-fill-1);
  border-radius: 9999px;
  transition: $transition;
  transform: translateX(0.1rem);
  display: block;

  &[data-state="checked"] {
    transform: translateX(1.65rem);
  }
}
</style>
