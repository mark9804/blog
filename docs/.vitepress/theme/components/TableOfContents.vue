<script setup lang="ts">
import type { ArticleInfo } from "../types/ArticleInfo";
import { data as usePosts } from "../loaders/posts.data";
import { computed } from "vue";
import ArticleCard from "./ArticleCard.vue";
import { formatDate, compareDates } from "../utils/timeUtils";
import { useWindowSize } from "@vueuse/core";

const contents = computed(() =>
  (usePosts as unknown as Array<ArticleInfo & { createdAtDate: string }>)
    .filter(el => !el.frontmatter?.meta?.hidden && !el.url.endsWith("/"))
    .map(el => {
      const createdAtTimestamp = el.createdAt ?? el.lastUpdated ?? new Date();
      el.createdAtDate = formatDate(createdAtTimestamp);
      return el;
    })
    .sort((a, b) => compareDates(a.createdAt, b.createdAt))
);

const { width } = useWindowSize();
</script>

<template>
  <a-timeline
    class="w-full mb-4"
    :label-position="width <= 475 ? 'same' : 'relative'"
  >
    <a-timeline-item v-for="content in contents" :key="content.url">
      <article-card :content="content" />
      <template #label>
        <p class="mb-4">{{ content.createdAtDate }}</p>
      </template>
    </a-timeline-item>
  </a-timeline>
</template>
