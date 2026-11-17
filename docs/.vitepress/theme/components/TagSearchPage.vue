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

const clearSelectedTags = () => {
  store.resetTags();
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
  <div class="tag-search-page flex flex-col w-full items-center pt-12 mb-24">
    <div
      class="flex flex-col gap-10 w-full max-w-[1272px] pl-16 pr-16 max-sm:pl-6 max-sm:pr-6"
      ref="containerRef"
    >
      <header
        class="tag-index-header relative pb-3 flex flex-wrap items-end justify-between gap-4"
      >
        <div class="flex items-baseline gap-3">
          <h1 class="tag-index-header__title m-0">Tags</h1>
          <span class="tag-index-header__count">
            {{ filteredPosts.length }} / {{ allPosts.length }} 篇
          </span>
        </div>

        <button
          v-if="selectedTags.length > 0"
          type="button"
          class="tag-index-header__clear cursor-pointer"
          @click="clearSelectedTags"
        >
          清除筛选 ({{ selectedTags.length }})
        </button>
      </header>

      <div class="tags-container flex flex-wrap gap-2.5">
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

<style scoped lang="scss">
.tag-index-header {
  border-bottom: 1px solid var(--color-accent-border-200);

  &::before {
    content: "";
    position: absolute;
    left: -14px;
    bottom: -1px;
    width: 14px;
    height: 1px;
    background-color: var(--color-accent-border-400);
  }

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -9px;
    width: 1px;
    height: 16px;
    background-color: var(--color-accent-border-300);
  }

  &__title {
    font-family: var(--font-family-serif);
    font-weight: 500;
    font-size: 1.75rem;
    line-height: 1.2;
    letter-spacing: 0.03em;
    color: var(--gouache-ink);
  }

  &__count {
    font-family: var(--font-family-base);
    font-size: 0.78rem;
    color: var(--color-accent-text-tertiary);
  }

  &__clear {
    padding: 4px 10px;
    font-family: var(--font-family-base);
    font-size: 12px;
    color: var(--color-accent);
    background-color: var(--gouache-wash);
    border: 1px solid var(--color-accent-border-200);
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover {
      background-color: var(--color-accent);
      color: var(--gouache-paper);
    }
  }
}
</style>
