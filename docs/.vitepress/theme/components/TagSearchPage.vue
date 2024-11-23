<script setup lang="ts">
import { useSearchTags } from "../utils/tagSearchUtils";
import { postData } from "../utils/usePostData";
import { computed, ref, watch, onMounted } from "vue";
import ArticleWaterfallList from "./ArticleWaterfallList.vue";
import ElyTag from "./ElysiumUI/ElyTag.vue";

const allTags = ref([]);
const allPosts = ref([]);

const selectedTags = ref([]);

const toggleTag = (tag: string) => {
  selectedTags.value = selectedTags.value.includes(tag)
    ? selectedTags.value.filter(t => t !== tag)
    : [...selectedTags.value, tag];
  if (!selectedTags.value.includes(tag)) {
    useSearchTags.remove(tag);
  } else {
    useSearchTags.push([tag]);
  }
};

const isTagActive = (tag: string) => selectedTags.value.includes(tag);

const filteredPosts = computed(() => {
  if (selectedTags.value.length === 0) return allPosts.value;
  return allPosts.value.filter(post =>
    selectedTags.value.every(tag => post.frontmatter?.tags?.includes(tag))
  );
});

onMounted(async () => {
  allTags.value = await postData.getAllTags();
  allPosts.value = await postData.getAllPosts();
  selectedTags.value = useSearchTags.get();
});
</script>

<template>
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
</template>

<style lang="scss" scoped></style>
