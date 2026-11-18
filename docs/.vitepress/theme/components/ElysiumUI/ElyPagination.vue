<script setup lang="ts">
import { computed } from "vue";
import { ChevronLeft, ChevronRight, Ellipsis } from "@lucide/vue";
import ElyButton from "./ElyButton.vue";
import { clamp } from "./_utils/numberUtils";

const props = withDefaults(
  defineProps<{
    total: number;
    current?: number;
    pageSize?: number;
  }>(),
  {
    current: 1,
    pageSize: 50,
  }
);

const emit = defineEmits<{
  (event: "change", page: number): void;
}>();

const ICON_SIZE = 18;

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.total / props.pageSize))
);

const currentPage = computed(() => clamp(props.current, 1, totalPages.value));

const computedPaginationItems = computed<
  { type: "number" | "ellipsis"; value: number }[]
>(() => {
  const pages: { type: "number" | "ellipsis"; value: number }[] = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push({ type: "number", value: i });
    }
    return pages;
  }

  pages.push({ type: "number", value: 1 });

  let startPage = Math.max(2, current - 2);
  let endPage = Math.min(total - 1, current + 2);

  // Keep 5 contiguous middle page numbers near the start or end edges
  if (endPage - startPage < 4) {
    if (startPage === 2) {
      endPage = Math.min(total - 1, startPage + 4);
    } else if (endPage === total - 1) {
      startPage = Math.max(2, endPage - 4);
    }
  }

  if (startPage > 2) {
    pages.push({ type: "ellipsis", value: Math.max(1, current - 5) });
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push({ type: "number", value: i });
  }

  if (endPage < total - 1) {
    pages.push({ type: "ellipsis", value: Math.min(total, current + 5) });
  }

  pages.push({ type: "number", value: total });

  return pages;
});

function handleGoToPage(page: number) {
  const next = clamp(page, 1, totalPages.value);
  if (next !== props.current) {
    emit("change", next);
  }
}

function handleSwitchPage(direction: "prev" | "next") {
  handleGoToPage(
    direction === "prev" ? currentPage.value - 1 : currentPage.value + 1
  );
}
</script>

<template>
  <div
    class="elysium-ui__pagination w-full flex justify-center items-center gap-2"
  >
    <ElyButton
      size="icon"
      secondary
      @click="handleSwitchPage('prev')"
      :disabled="currentPage <= 1"
      aria-label="Previous Page"
    >
      <ChevronLeft :size="ICON_SIZE" />
    </ElyButton>

    <template v-for="(item, index) in computedPaginationItems" :key="index">
      <ElyButton
        size="icon"
        :secondary="item.value !== currentPage"
        :active="item.value === currentPage"
        @click="handleGoToPage(item.value)"
        :aria-label="`Page ${item.value}`"
      >
        <template v-if="item.type === 'number'">{{ item.value }}</template>
        <Ellipsis v-else :size="ICON_SIZE" />
      </ElyButton>
    </template>

    <ElyButton
      size="icon"
      secondary
      @click="handleSwitchPage('next')"
      :disabled="currentPage >= totalPages"
      aria-label="Next Page"
    >
      <ChevronRight :size="ICON_SIZE" />
    </ElyButton>
  </div>
</template>
