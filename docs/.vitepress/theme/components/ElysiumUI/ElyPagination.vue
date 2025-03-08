<script setup lang="ts">
import { computed, ref, watch } from "vue";
import ElyButton from "./ElyButton.vue";
import { IconLeft, IconRight, IconMore } from "@arco-design/web-vue/es/icon";
import { clamp } from "./_utils/numberUtils";
const props = withDefaults(
  defineProps<{
    total: number;
    current: number;
    pageSize: number;
  }>(),
  {
    current: 1,
    pageSize: 50,
  }
);

const userCurrent = ref(props.current);
const computedPaginationItems = computed<
  { type: "number" | "ellipsis"; value: number }[]
>(() => {
  // 以 userCurrent 为中心，最多显示连续五个页码
  // 显示开头和结尾页码
  // 其余部分显示省略号
  // ellipsis 时 value 为 current + 5，最大为 total，最小为 1
  const pages: { type: "number" | "ellipsis"; value: number }[] = [];

  // 总页数
  const total = totalPages.value;
  const current = userCurrent.value;

  // 如果总页数小于等于7，直接显示所有页码
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push({ type: "number", value: i });
    }
    return pages;
  }

  // 添加第一页
  pages.push({ type: "number", value: 1 });

  // 计算中间显示的页码范围
  let startPage = Math.max(2, current - 2);
  let endPage = Math.min(total - 1, current + 2);

  // 调整范围确保显示5个连续页码
  if (endPage - startPage < 4) {
    if (startPage === 2) {
      endPage = Math.min(total - 1, startPage + 4);
    } else if (endPage === total - 1) {
      startPage = Math.max(2, endPage - 4);
    }
  }

  // 添加前省略号
  if (startPage > 2) {
    pages.push({ type: "ellipsis", value: Math.max(1, current - 5) });
  }

  // 添加中间页码
  for (let i = startPage; i <= endPage; i++) {
    pages.push({ type: "number", value: i });
  }

  // 添加后省略号
  if (endPage < total - 1) {
    pages.push({ type: "ellipsis", value: Math.min(total, current + 5) });
  }

  // 添加最后一页
  pages.push({ type: "number", value: total });

  return pages;
});

function handleSwitchPage(direction: "prev" | "next") {
  userCurrent.value =
    direction === "prev"
      ? clamp(userCurrent.value - 1, 1, props.total)
      : clamp(userCurrent.value + 1, 1, props.total);
}

function handleGoToPage(page: number) {
  userCurrent.value = clamp(page, 1, props.total);
}

const totalPages = computed(() => Math.ceil(props.total / props.pageSize));

const emit = defineEmits<{
  (event: "change", page: number): void;
}>();

watch(userCurrent, () => {
  emit("change", userCurrent.value);
});
</script>

<template>
  <div
    class="elysium-ui__pagination w-full flex justify-center items-center gap-2"
  >
    <ElyButton
      secondary
      :style="{ width: '32px', height: '32px', padding: '0' }"
      @click="handleSwitchPage('prev')"
      :disabled="userCurrent === 1"
      aria-label="Previous Page"
    >
      <IconLeft />
    </ElyButton>

    <template v-for="(item, index) in computedPaginationItems" :key="index">
      <ElyButton
        :secondary="item.value !== userCurrent"
        :style="{ width: '32px', height: '32px', padding: '0' }"
        :class="{ 'bg-primary text-white': item.value === userCurrent }"
        @click="handleGoToPage(item.value)"
        :aria-label="`Page ${item.value}`"
      >
        <template v-if="item.type === 'number'">{{ item.value }}</template>
        <IconMore v-else />
      </ElyButton>
    </template>

    <ElyButton
      secondary
      :style="{ width: '32px', height: '32px', padding: '0' }"
      @click="handleSwitchPage('next')"
      :disabled="userCurrent === totalPages"
      aria-label="Next Page"
    >
      <IconRight />
    </ElyButton>
  </div>
</template>

<style scoped lang="scss"></style>
