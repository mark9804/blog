<script setup lang="ts">
import {
  computed,
  ref,
  watch,
  nextTick,
  onMounted,
  onUnmounted,
  useTemplateRef,
} from "vue";
import { cluster } from "radashi";
import type { Post } from "../types/Post";
import ElyPagination from "./ElysiumUI/ElyPagination.vue";
import ElyEmptyState from "./ElysiumUI/ElyEmptyState.vue";

const props = withDefaults(
  defineProps<{
    posts: Post[];
    width?: number;
  }>(),
  {
    width: 0,
  }
);

const currentPage = ref(1);
const pageSize = ref(20);
const isClientReady = ref(false);

const GUTTER = 28;
const MIN_CARD_WIDTH = 272;

const waterfallCount = computed(() =>
  Math.max(Math.floor((props.width + GUTTER) / (MIN_CARD_WIDTH + GUTTER)), 1)
);

const gapSize = computed(() => GUTTER);

const cardWidth = computed(() =>
  Math.floor(
    (props.width - (waterfallCount.value - 1) * gapSize.value) /
      waterfallCount.value
  )
);

const waterfallContainerRef = useTemplateRef<HTMLDivElement[]>(
  "waterfallContainerRef"
);
const waterfallItemsList = ref<Post[][]>([]);

let layoutEpoch = 0;
let isUnmounted = false;

async function findShortestColumn(assumeImageHeight = 0): Promise<number> {
  await nextTick();
  const containers = waterfallContainerRef.value;
  if (!containers || containers.length === 0) return 0;

  let minHeight = Infinity;
  let targetColumnIndex = 0;

  for (let i = 0; i < containers.length; i++) {
    const col = containers[i];
    if (!col) continue;
    const height = col.offsetHeight + assumeImageHeight;
    if (height < minHeight) {
      minHeight = height;
      targetColumnIndex = i;
    }
  }

  return targetColumnIndex;
}

const chunkedPosts = computed(() => cluster(props.posts, pageSize.value));

const paginatedPosts = computed(
  () => chunkedPosts.value[currentPage.value - 1] ?? []
);

async function distributeWaterfall() {
  if (!isClientReady.value || props.width <= 0) return;

  const epoch = ++layoutEpoch;
  const colCount = waterfallCount.value;
  const items = paginatedPosts.value;

  waterfallItemsList.value = Array.from({ length: colCount }, () => []);

  if (items.length === 0) return;

  for (const post of items) {
    const targetColumnIndex = await findShortestColumn();
    // Abort stale async runs so concurrent ResizeObserver/router updates never duplicate keys
    if (isUnmounted || epoch !== layoutEpoch) return;
    const bucket = waterfallItemsList.value[targetColumnIndex];
    if (bucket) {
      bucket.push(post);
    }
  }
}

// Re-distribute only when column count, post slice, or initial non-zero measurement changes.
// Pure cardWidth adjustments within the same column count resize smoothly via CSS.
const hasMeasuredWidth = computed(() => props.width > 0);

watch(
  () => [hasMeasuredWidth.value, waterfallCount.value, paginatedPosts.value],
  () => {
    distributeWaterfall();
  }
);

// Reset to page 1 when switching tabs or tag filters shrinks total page count
watch(
  () => props.posts,
  () => {
    currentPage.value = 1;
  }
);

function handlePageChange(page: number) {
  currentPage.value = page;
}

onMounted(() => {
  isClientReady.value = true;
  distributeWaterfall();
});

onUnmounted(() => {
  isUnmounted = true;
  layoutEpoch += 1;
});
</script>

<template>
  <div
    v-if="posts.length > 0"
    class="article-list__waterfall flex flex-col w-full gap-8"
  >
    <div
      class="article-list__waterfall__articles-container flex justify-between w-full items-start"
    >
      <div
        class="article-list__waterfall-item flex flex-col"
        :style="{ gap: `${gapSize}px`, width: `${cardWidth}px` }"
        v-for="(items, colIdx) in waterfallItemsList"
        :key="colIdx"
        ref="waterfallContainerRef"
      >
        <ElyCard
          v-for="post in items"
          :key="post.url"
          :content="post"
          :max-width="cardWidth"
        />
      </div>
    </div>
    <ElyPagination
      :total="posts.length"
      :current="currentPage"
      :page-size="pageSize"
      @change="handlePageChange"
    />
  </div>
  <ElyEmptyState v-else />
</template>

<style scoped lang="scss">
// Flat matte gouache layout: zero blurry container drop-shadows
</style>
