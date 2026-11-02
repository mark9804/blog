<script lang="ts" setup>
import type { ToasterProps } from "vue-sonner";
import {
  CircleCheck,
  Info,
  Loader2,
  OctagonX,
  TriangleAlert,
  X as Close,
} from "@lucide/vue";
import { Toaster, toast } from "vue-sonner";
import { useData } from "vitepress";
const props = defineProps<ToasterProps>();

const { isDark } = useData();

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
      <CircleCheck class="size-4" />
    </template>
    <template #info-icon>
      <Info class="size-4" />
    </template>
    <template #warning-icon>
      <TriangleAlert class="size-4" />
    </template>
    <template #error-icon>
      <OctagonX class="size-4" />
    </template>
    <template #loading-icon>
      <div>
        <Loader2 class="size-4 animate-spin" />
      </div>
    </template>
    <template #close-icon>
      <Close class="size-4" />
    </template>
  </Toaster>
</template>
