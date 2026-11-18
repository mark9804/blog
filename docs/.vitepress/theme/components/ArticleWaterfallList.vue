<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from "vue";
import { useElementSize } from "@vueuse/core";
import type { Post } from "../types/Post";
import ElyCard from "./ElysiumUI/ElyCard.vue";
import ElyPagination from "./ElysiumUI/ElyPagination.vue";
import ElyEmptyState from "./ElysiumUI/ElyEmptyState.vue";

const props = defineProps<{
  posts: Post[];
}>();

const PAGE_SIZE = 20;
const DEFAULT_SSR_COLUMNS = 3;
const GUTTER = 28;
const MIN_CARD_WIDTH = 272;

const currentPage = ref(1);
const containerRef = useTemplateRef<HTMLDivElement>("containerRef");
const { width } = useElementSize(containerRef);

// Default to 3 columns on SSR and initial hydration before ResizeObserver fires
const colCount = computed(() =>
  width.value > 0
    ? Math.max(
        1,
        Math.floor((width.value + GUTTER) / (MIN_CARD_WIDTH + GUTTER))
      )
    : DEFAULT_SSR_COLUMNS
);

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE;
  return props.posts.slice(start, start + PAGE_SIZE);
});

// Deterministic card height estimate from post metadata (zero DOM reflows)
function estimatePostWeight(post: Post): number {
  const baseChrome = 112;
  const coverWeight = post.frontmatter.cover ? 200 : 0;
  const titleLines = Math.max(
    1,
    Math.ceil((post.frontmatter.title?.length ?? 0) / 16)
  );
  const descLength = post.frontmatter.description?.length ?? 0;
  const descWeight = descLength > 0 ? 14 + Math.ceil(descLength / 22) * 23 : 0;
  const tagCount = post.frontmatter.tags?.length ?? 0;
  const tagWeight = tagCount > 0 ? 16 + Math.ceil(tagCount / 3) * 26 : 0;

  return baseChrome + coverWeight + titleLines * 26 + descWeight + tagWeight;
}

const waterfallColumns = computed<Post[][]>(() => {
  const count = colCount.value;
  const columns: Post[][] = Array.from({ length: count }, () => []);
  const heights = new Array<number>(count).fill(0);

  for (const post of paginatedPosts.value) {
    let targetIdx = 0;
    for (let i = 1; i < count; i++) {
      if (heights[i] < heights[targetIdx]) {
        targetIdx = i;
      }
    }
    columns[targetIdx].push(post);
    heights[targetIdx] += estimatePostWeight(post) + GUTTER;
  }

  return columns;
});

// Reset to page 1 when switching tabs or tag filters changes the post list
watch(
  () => props.posts,
  () => {
    currentPage.value = 1;
  }
);

function handlePageChange(page: number) {
  currentPage.value = page;
}
</script>

<template>
  <div
    v-if="posts.length > 0"
    ref="containerRef"
    class="article-list__waterfall flex flex-col w-full gap-8"
  >
    <div class="article-list__waterfall__articles-container">
      <div
        v-for="(items, colIdx) in waterfallColumns"
        :key="colIdx"
        class="article-list__waterfall-item"
      >
        <ElyCard
          v-for="post in items"
          :key="post.url"
          :content="post"
          max-width="100%"
        />
      </div>
    </div>
    <ElyPagination
      :total="posts.length"
      :current="currentPage"
      :page-size="PAGE_SIZE"
      @change="handlePageChange"
    />
  </div>
  <ElyEmptyState v-else />
</template>

<style scoped lang="scss">
.article-list__waterfall {
  &__articles-container {
    display: flex;
    align-items: flex-start;
    gap: 28px;
    width: 100%;
  }

  &-item {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }
}
</style>
