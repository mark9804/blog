<script setup lang="ts">
import { computed } from "vue";
import { postData, createFilter } from "../utils/usePostData";
import { useTagNavigation } from "../composables/useTagNavigation";
import ArticleWaterfallList from "./ArticleWaterfallList.vue";
import ElyButton from "./ElysiumUI/ElyButton.vue";
import ElyTag from "./ElysiumUI/ElyTag.vue";

const allPosts = postData.getAllPosts(createFilter());
const allTags = postData.getAllTags().sort((a, b) => a.localeCompare(b));
const validTags = new Set(allTags);

const { selectedTags, toggleTag, clearTags } = useTagNavigation(validTags);
const selectedTagSet = computed(() => new Set(selectedTags.value));

const filteredPosts = computed(() => {
  if (selectedTagSet.value.size === 0) return allPosts;
  return allPosts.filter(post =>
    post.frontmatter?.tags?.some(tag => selectedTagSet.value.has(tag))
  );
});
</script>

<template>
  <div class="tag-search-page flex flex-col w-full items-center pt-12 mb-24">
    <div
      class="flex flex-col gap-10 w-full max-w-[1272px] pl-16 pr-16 max-sm:pl-6 max-sm:pr-6"
    >
      <header
        class="tag-index-header ely-section-header pb-3 flex flex-wrap items-end justify-between gap-4"
      >
        <div class="flex items-baseline gap-3">
          <h1 class="tag-index-header__title m-0">Tags</h1>
          <span class="tag-index-header__count">
            {{ filteredPosts.length }} / {{ allPosts.length }} 篇
          </span>
        </div>

        <ElyButton
          v-if="selectedTags.length > 0"
          secondary
          size="small"
          @click="clearTags"
        >
          清除筛选 ({{ selectedTags.length }})
        </ElyButton>
      </header>

      <div class="tags-container flex flex-wrap gap-2.5">
        <ElyTag
          v-for="tag in allTags"
          :key="tag"
          clickable
          :active="selectedTagSet.has(tag)"
          @click="toggleTag(tag)"
        >
          {{ tag }}
        </ElyTag>
      </div>

      <ArticleWaterfallList :posts="filteredPosts" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.tag-index-header {
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
}
</style>
