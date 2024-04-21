<script setup lang="ts">
import { ArticleInfo } from "../types/ArticleInfo";
import { data as usePosts } from "../helper/posts.data";
import { computed } from "vue";
import TableOfContent from "./TableOfContent.vue";

const useContents = computed(() =>
  // @ts-ignore
  usePosts.filter(
    (el: ArticleInfo) => !el.frontmatter?.meta?.hidden && !el.url.endsWith("/")
  )
);

console.log(useContents);
</script>

<template>
  <ul class="flex flex-col gap-[20px] w-full list-none p-0 m-0">
    <li v-for="content in useContents" :key="content.url">
      <table-of-content :content="content"></table-of-content>
    </li>
  </ul>
</template>

<style scoped lang="scss"></style>
