<script setup lang="ts">
import { computed, ref, watch, nextTick, useTemplateRef } from "vue";
import { clamp } from "./ElysiumUI/_utils/numberUtils";
import type { Post } from "../types/Post";

const props = withDefaults(
  defineProps<{
    posts: Post[];
    width?: number;
  }>(),
  {
    width: 1280,
  }
);

const waterfallCount = computed(() =>
  Math.max(Math.floor(props.width / 290), 1)
);

const cardWidth = computed(() => (props.width >= 375 ? 280 : props.width));

const gapSize = computed(() =>
  clamp(
    (props.width - waterfallCount.value * cardWidth.value) /
      (waterfallCount.value - 1 || 1),
    24,
    32
  )
);

const waterfallContainerRef = useTemplateRef<HTMLDivElement[]>(
  "waterfallContainerRef"
);
const waterfallItemsList = ref<Post[][]>([]);

/**
 * 找到一个高度最短的列
 * @param {number} assumeImageHeight 假设的图片高度
 * @returns {number} 最短列的索引
 */
async function findShortestColumn(assumeImageHeight = 0) {
  await nextTick();
  const containers = waterfallContainerRef.value;
  if (!containers) return 0;

  let minHeight = Infinity;
  let targetColumnIndex = 0;

  for (let i = 0; i < containers.length; i++) {
    const height = containers[i].offsetHeight + assumeImageHeight;
    if (height < minHeight) {
      minHeight = height;
      targetColumnIndex = i;
    }
  }

  return targetColumnIndex;
}

function handleLoaded() {
  findShortestColumn();
}

function handleSuspense() {
  findShortestColumn(400);
}

watch(
  () => [waterfallCount.value, cardWidth.value, props.posts],
  async () => {
    waterfallItemsList.value = Array.from(
      { length: waterfallCount.value },
      () => []
    );

    // 找到一个高度最短的列，把文章卡片塞进去
    for (const post of props.posts) {
      const targetColumnIndex = await findShortestColumn();
      waterfallItemsList.value[targetColumnIndex].push(post);
    }
  }
);
</script>

<template>
  <div
    class="article-list__waterfall-container flex justify-between w-full items-start"
  >
    <div
      class="article-list__waterfall-item flex flex-col"
      :style="{ gap: `${gapSize}px`, width: `${cardWidth}px` }"
      v-for="items in waterfallItemsList"
      ref="waterfallContainerRef"
    >
      <ElyCard
        v-for="post in items"
        :key="post.url"
        :content="post"
        :max-width="cardWidth"
        @loaded="handleLoaded"
        @suspense="handleSuspense"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.article-list__waterfall-container {
  filter: drop-shadow(0 1rem 2rem var(--color-accent-shadow-200));
}
</style>
