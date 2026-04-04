<script lang="ts" setup>
import type { ToasterProps } from "vue-sonner";
import {
  CircleCheck,
  Info,
  Loader2,
  OctagonX,
  TriangleAlert,
  X as Close,
} from "lucide-vue-next";
import { Toaster, toast } from "vue-sonner";
import { useData } from "vitepress";
import { useDark } from "@vueuse/core";
const props = defineProps<ToasterProps>();

const { isDark: themeIsDark } = useData();
const isDark = computed(() => useDark().value || themeIsDark.value);

// 导出 toast 函数供外部调用
defineExpose({
  toast,
});
</script>

<template>
  <Toaster
    class="elysium-ui__toast-message"
    v-bind="props"
    rich-colors
    :theme="isDark ? 'dark' : 'light'"
  >
    <template #success-icon>
      <circle-check class="size-4" />
    </template>
    <template #info-icon>
      <info class="size-4" />
    </template>
    <template #warning-icon>
      <triangle-alert class="size-4" />
    </template>
    <template #error-icon>
      <octagon-x class="size-4" />
    </template>
    <template #loading-icon>
      <div>
        <loader2 class="size-4 animate-spin" />
      </div>
    </template>
    <template #close-icon>
      <Close class="size-4" />
    </template>
  </Toaster>
</template>
