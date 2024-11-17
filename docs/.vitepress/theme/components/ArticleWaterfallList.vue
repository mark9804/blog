<script setup lang="ts">
import { computed } from "vue";
import { useWindowSize } from "@vueuse/core";
import type { Post } from "../types/Post";

const props = defineProps<{
  posts: Post[];
}>();

const { width } = useWindowSize();

const waterfallCount = computed(() =>
  Math.max(Math.floor(Math.min(width.value, 1280) / 290), 1)
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
      class="article-list__waterfall-item flex flex-col gap-5"
      v-for="items in waterfallItemsList"
    >
      <ElyCard v-for="post in items" :key="post.url" :content="post" />
    </div>
  </div>
</template>
