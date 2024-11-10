<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { data as usePosts } from "../loaders/posts.data";
import type { ArticleInfo } from "../types/ArticleInfo";
import { unique } from "radash";
import ArticleCard from "./ArticleCard.vue";

function shouldShowInResult(el: ArticleInfo) {
  return !el.url.endsWith("/") && !el.frontmatter?.meta?.hidden;
}

const useTags = computed(() => {
  const seen = new Set();
  return (usePosts as unknown as ArticleInfo[])
    .filter(shouldShowInResult)
    .filter(el => {
      const duplicate = seen.has(el.url);
      seen.add(el.url);
      return !duplicate;
    })
    .map(el => ({
      tags: el.frontmatter.tags ?? [],
      title: el.frontmatter.title,
      cover: el.frontmatter.cover,
      url: el.url,
      readingTime: el.readingTime,
      wordsCount: el.wordsCount,
      imgCount: el?.imgCount,
    }));
});

const allTags = computed<string[]>(() =>
  Array.from(new Set(useTags.value.flatMap(tagRaw => tagRaw.tags)))
);

const initKeywords = computed(() => {
  const params = new URLSearchParams(window.location.search);
  const keywordsParam = params.get("keywords");
  return keywordsParam ? keywordsParam.split(",").filter(Boolean) : [];
});

const searchValue = ref<string[]>(initKeywords.value);
const recommendations = ref<string[]>([]);
const residuals = ref("");

function updateSearchUrl(newValue: string[]) {
  const currentUrl = new URL(window.location.href);
  if (newValue.length > 0) {
    currentUrl.searchParams.set("keywords", newValue.join(","));
  } else {
    currentUrl.searchParams.delete("keywords");
  }
  history.replaceState({}, "", currentUrl.toString());
}

watch(
  () => searchValue.value,
  newValue => {
    updateSearchUrl(newValue);
  },
  { immediate: true }
);

function getResiduals(inputValue: string) {
  if (!inputValue?.trim()) {
    recommendations.value = [];
    return;
  }

  residuals.value = inputValue;
  const inputLower = inputValue.toLowerCase();
  recommendations.value = allTags.value.filter(
    tag =>
      tag.toLowerCase().includes(inputLower) && !searchValue.value.includes(tag)
  );
}

function addTag(tag: string) {
  if (searchValue.value.includes(tag)) return;
  searchValue.value.push(tag);
  // FIXME: 为什么添加触发不了 watch 但是删除可以？？？
  updateSearchUrl(searchValue.value);
  residuals.value = "";
  recommendations.value = [];
}

// 添加自定义渲染函数，让标签支持匹配高亮
function renderTagText(tag: string, matches: string) {
  const matchingReg = new RegExp(matches, "gi");
  return tag.replace(
    matchingReg,
    (match: string) => `<span class="text-match">${match}</span>`
  );
}

const displayedArticles = computed(() => {
  if (searchValue.value.length === 0) return useTags.value;

  return useTags.value.filter(tagRaw => {
    return searchValue.value.every(searchTag =>
      tagRaw.tags.includes(searchTag)
    );
  });
});
</script>

<template>
  <div class="flex flex-col w-full p-5 items-center gap-4">
    <div class="flex flex-wrap gap-4 w-full max-w-[1280px] overflow-x-scroll">
      <a-tag
        class="cursor-pointer flex-shrink-0"
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
          imgCount: article?.imgCount,
          wordsCount: article.wordsCount,
        }"
      />
    </div>
  </div>
</template>
