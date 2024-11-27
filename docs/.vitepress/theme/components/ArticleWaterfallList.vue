<script setup lang="ts">
import { computed } from "vue";
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
  Math.max(
    (props.width - waterfallCount.value * cardWidth.value) /
      (waterfallCount.value - 1 || 1),
    24
  )
);

const waterfallItemsList = computed(() => {
  const tempList = Array.from({ length: waterfallCount.value }, () => []);
  for (let i = 0; i < props.posts.length; i++) {
    tempList[i % waterfallCount.value].push(props.posts[i]);
  }
  return tempList;
});
</script>

<template>
  <div class="article-list__waterfall-container flex justify-between w-full">
    <div
      class="article-list__waterfall-item flex flex-col"
      :style="{ gap: `${gapSize}px`, width: `${cardWidth}px` }"
      v-for="items in waterfallItemsList"
    >
      <ElyCard
        v-for="post in items"
        :key="post.url"
        :content="post"
        :max-width="cardWidth"
      />
    </div>
  </div>
</template>
