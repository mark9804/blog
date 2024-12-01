<script setup lang="ts">
import { postData, defaultFilter } from "../utils/usePostData";
import { computed, ref, useTemplateRef } from "vue";
import ArticleWaterfallList from "./ArticleWaterfallList.vue";
import ElyTag from "./ElysiumUI/ElyTag.vue";
import { useCustomStore } from "../../piniaStore";
import { useElementSize } from "@vueuse/core";

const store = useCustomStore();

const containerRef = useTemplateRef<HTMLDivElement>("containerRef");
const { width } = useElementSize(containerRef);

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

postData.getAllPosts(defaultFilter).then(res => {
  allPosts.value = res;
});

postData.getAllTags().then(res => {
  allTags.value = res.sort((a, b) => a.localeCompare(b));
});
</script>

<template>
  <div class="flex flex-col w-full items-center pt-10 mb-20">
    <div
      class="flex flex-col gap-10 max-w-[1272px] pl-16 xs:pl-10 xs:pr-10 pr-16"
      ref="containerRef"
    >
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
      <ArticleWaterfallList :posts="filteredPosts" :width="width" />
    </div>
  </div>
</template>
