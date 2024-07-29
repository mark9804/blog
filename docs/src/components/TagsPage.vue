<script setup lang="ts">
import { computed, ref } from "vue";
import { data as usePosts } from "../helper/posts.data";
import { ArticleInfo } from "../types/ArticleInfo";
import { sift, unique } from "radash";
import ArticleCard from "./ArticleCard.vue";

function shouldShowInResult(el: ArticleInfo) {
  return !el.url.endsWith("/") && !el.frontmatter?.meta?.hidden;
}

const useTags = computed(() => {
  return sift(
    Array.from(
      (usePosts as unknown as ArticleInfo[]).map((el: ArticleInfo) => {
        return shouldShowInResult(el)
          ? {
              tags: el.frontmatter.tags ?? [],
              title: el.frontmatter.title,
              cover: el.frontmatter.cover,
              url: el.url,
              readingTime: el.readingTime,
              wordsCount: el.wordsCount,
            }
          : null;
      })
    )
  );
});

const allTags = computed<string[]>(() =>
  Array.from(new Set(useTags.value.map(tagRaw => tagRaw.tags))).flat()
);

const initKeyword = window.location.search
  ? decodeURIComponent(window.location.search.split("?")[1].split("=")[1])
  : null;

const searchValue = ref<string[]>(initKeyword ? [initKeyword] : []);
const recommendations = ref<string[]>([]);
const residuals = ref("");

function getResiduals(inputValue: string) {
  if ([null, undefined, ""].includes(inputValue)) {
    recommendations.value = [];
  } else {
    residuals.value = inputValue;
    allTags.value.forEach(
      tag =>
        tag.toLowerCase().includes(inputValue.toLowerCase()) &&
        !searchValue.value.includes(tag) &&
        !recommendations.value.includes(tag) &&
        recommendations.value.push(tag)
    );
  }
}

function addTag(tag: string) {
  if (searchValue.value.includes(tag)) return;
  searchValue.value.push(tag);
  residuals.value = "";
  recommendations.value = [];
}

function renderTagText(tag: string, matches: string) {
  const matchingReg = new RegExp(matches, "gi");
  return tag.replace(
    matchingReg,
    (match: string) => `<span class="text-match">${match}</span>`
  );
}

const displayedArticles = computed(() => {
  return useTags.value.filter(tagRaw => {
    return searchValue.value.some(searchTag => tagRaw.tags.includes(searchTag));
  });
});
</script>

<template>
  <div class="flex flex-col w-full p-5 items-center gap-4">
    <div class="flex flex-nowrap gap-4 w-full max-w-[1280px] overflow-x-scroll">
      <a-tag
        class="cursor-pointer"
        color="arcoblue"
        v-for="tag in unique(allTags)"
        @click="addTag(tag)"
      >
        <template #icon>
          <icon-tag />
        </template>
        {{ tag }}
      </a-tag>
    </div>
    <a-dropdown
      :popup-visible="recommendations.length > 0"
      class="w-full max-w-[1280px]"
    >
      <a-input-tag
        allow-clear
        retain-input-value
        @input-value-change="getResiduals"
        class="w-full max-w-[1280px]"
        v-model="searchValue"
        placeholder="搜索标签"
      />
      <template #content>
        <a-doption
          v-for="tag in recommendations"
          :key="tag"
          class="w-full max-w-[1280px]"
          @click="addTag(tag)"
        >
          <span v-html="renderTagText(tag, residuals)"></span>
        </a-doption>
      </template>
    </a-dropdown>
    <div v-auto-animate class="flex flex-col gap-2 w-full items-center">
      <article-card
        class="w-full max-w-[1280px]"
        v-for="article in displayedArticles"
        :key="article.url"
        :content="{
          frontmatter: {
            title: article.title,
            tags: article.tags,
            cover: article.cover,
          },
          url: article.url,
          readingTime: article.readingTime,
          wordsCount: article.wordsCount,
        }"
      />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
