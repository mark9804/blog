<script setup lang="ts">
import { postData, createFilter } from "../utils/usePostData";
import { computed, useTemplateRef, onMounted, onActivated } from "vue";
import ArticleWaterfallList from "./ArticleWaterfallList.vue";
import ElyTag from "./ElysiumUI/ElyTag.vue";
import { useCustomStore } from "../../stores/piniaStore";
import { useElementSize } from "@vueuse/core";

const store = useCustomStore();

const containerRef = useTemplateRef<HTMLDivElement>("containerRef");
const { width } = useElementSize(containerRef);

const allPosts = postData.getAllPosts(createFilter());
const allTags = postData.getAllTags().sort((a, b) => a.localeCompare(b));

const selectedTags = computed(() => store.getSelectedTags);

// 移除失效 tag
// 失效 tag：在某次选中之后，由于文章更改，导致已经不存在这个 tag 了
// 会导致永远无法匹配到任何文章，用户也不能手动移除这个 tag
function removeInvalidTags() {
  if (allTags.length === 0) return;
  selectedTags.value.forEach(tag => {
    if (!allTags.includes(tag)) {
      store.removeSelectedTags(tag);
    }
  });
}

const toggleTag = (tag: string) => {
  if (selectedTags.value.includes(tag)) {
    store.removeSelectedTags(tag);
  } else {
    store.pushSelectedTags(tag);
  }
};

const isTagActive = (tag: string) => selectedTags.value.includes(tag);

const filteredPosts = computed(() => {
  if (selectedTags.value.length === 0) return allPosts;
  return allPosts.filter(post =>
    selectedTags.value.some(tag => post.frontmatter?.tags?.includes(tag))
  );
});

onMounted(removeInvalidTags);
onActivated(removeInvalidTags);
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
