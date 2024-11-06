<script setup lang="ts">
import type { ArticleInfo } from "@/types/ArticleInfo";
import { data as usePosts } from "@/helper/posts.data";
import { computed } from "vue";
import ArticleCard from "./ArticleCard.vue";
import dayjs from "dayjs";
import { useWindowSize } from "@vueuse/core";
import { useData } from "vitepress";

const { page } = useData();

console.log(page.value);

const useContents = computed(() =>
  (usePosts as unknown as ArticleInfo[])
    .filter(
      (el: ArticleInfo) =>
        !el.frontmatter?.meta?.hidden && !el.url.endsWith("/")
    )
    .map((el: ArticleInfo) => {
      el.lastUpdated = dayjs(el.lastUpdated ?? new Date()).format("YYYY-MM-DD");
      return el;
    })
    .sort((a: ArticleInfo, b: ArticleInfo) =>
      dayjs(a.lastUpdated).isBefore(dayjs(b.lastUpdated)) ? 1 : -1
    )
);

const { width } = useWindowSize();
</script>

<template>
  <a-timeline
    class="w-full mb-4"
    :label-position="width <= 475 ? 'same' : 'relative'"
  >
    <a-timeline-item v-for="content in useContents" :key="content.url">
      <article-card :content="content" />
      <template #label>
        <p class="mb-4">{{ content.lastUpdated }}</p>
      </template>
    </a-timeline-item>
  </a-timeline>
</template>

<style scoped lang="scss"></style>
