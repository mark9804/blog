<script setup lang="ts">
import { postData } from "../utils/usePostData";
import { computed, ref } from "vue";
import ArticleWaterfallList from "./ArticleWaterfallList.vue";
import ElyTag from "./ElysiumUI/ElyTag.vue";
import { useCustomStore } from "../../piniaStore";

const store = useCustomStore();

const allTags = ref([]);
const allPosts = ref([]);

const selectedTags = computed(() => store.getSelectedTags);

const toggleTag = (tag: string) => {
  if (selectedTags.value.includes(tag)) {
    store.removeSelectedTags(tag);
  } else {
    store.pushSelectedTags(tag);
  }
};

const isTagActive = (tag: string) => selectedTags.value.includes(tag);

const filteredPosts = computed(() => {
  if (selectedTags.value.length === 0) return allPosts.value;
  return allPosts.value.filter(post =>
    selectedTags.value.some(tag => post.frontmatter?.tags?.includes(tag))
  );
});

postData
  .getAllPosts(el => !el.frontmatter?.meta?.hidden && !el.url.endsWith("/"))
  .then(res => {
    allPosts.value = res;
  });

postData.getAllTags().then(res => {
  allTags.value = res;
});
</script>

<template>
  <div class="flex flex-col w-full items-center pt-10">
    <div class="flex flex-col w-full max-w-[1280px] p-5 items-center gap-5">
      <div class="tags-container flex flex-wrap gap-4">
        <ElyTag
          clickable
          :active="isTagActive(tag)"
          @click="toggleTag(tag)"
          v-for="tag in allTags"
          :key="tag"
          :id="tag"
        >
          {{ tag }}
        </ElyTag>
      </div>
      <ArticleWaterfallList :posts="filteredPosts" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
