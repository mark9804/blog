<script setup lang="ts">
import { ArticleInfo } from "../types/ArticleInfo";
import { data as usePosts } from "../helper/posts.data";
import { computed } from "vue";
import TableOfContent from './TableOfContent.vue';
const useContents = computed(() =>
  usePosts.filter((el: ArticleInfo) => !el.frontmatter?.meta?.hidden)
);
</script>

<template>
  <ul class="toc">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,1,0" />
    <li v-for="content in useContents" :key="content.url">
      <table-of-content :content="content"></table-of-content>
    </li>
  </ul>
</template>

<style scoped lang="scss">
ul.toc {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
