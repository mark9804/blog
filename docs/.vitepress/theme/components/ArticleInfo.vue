<script setup lang="ts">
import { useData, useRoute, withBase } from "vitepress";
import { computed, type ComputedRef } from "vue";
import { Timer, History } from "@lucide/vue";
import type { PostFrontmatter } from "../types/Post";
import { postData } from "../utils/usePostData";
import { formatDateTime } from "../utils/timeUtils";
import { useTagNavigation } from "../composables/useTagNavigation";
import ElyTag from "./ElysiumUI/ElyTag.vue";
import ElyTooltip from "./ElysiumUI/ElyTooltip.vue";

const { frontmatter: rawFrontmatter, page } = useData();
const frontmatter = rawFrontmatter as ComputedRef<PostFrontmatter>;
const route = useRoute();
const { navigateToTag } = useTagNavigation();

const normalizedPath = computed(() => {
  const base = withBase("/");
  return route.path.startsWith(base)
    ? "/" + route.path.slice(base.length)
    : route.path;
});

const currentPost = computed(() => postData.getPost(normalizedPath.value));

const isArticlePage = computed(
  () =>
    frontmatter.value.publish !== false ||
    frontmatter.value.createdAt !== undefined
);

const showArticleInfo = computed(
  () =>
    !frontmatter.value.meta?.hideArticleInfo &&
    isArticlePage.value &&
    !normalizedPath.value.endsWith("/") &&
    Boolean(currentPost.value?.createdAt)
);

const createdAtTimestamp = computed(() => currentPost.value?.createdAt ?? 0);
const readingTime = computed(() => currentPost.value?.readingTime ?? 0);
const wordsCount = computed(() => currentPost.value?.wordsCount ?? 0);
const imgCount = computed(() => currentPost.value?.imgCount ?? 0);

const lastUpdatedTimestamp = computed(() => page.value.lastUpdated ?? 0);
const lastUpdated = computed(() => formatDateTime(lastUpdatedTimestamp.value));
const createdAt = computed(() => formatDateTime(createdAtTimestamp.value));

const hasPostUpdate = computed(
  () =>
    lastUpdatedTimestamp.value > 0 &&
    createdAtTimestamp.value > 0 &&
    lastUpdatedTimestamp.value !== createdAtTimestamp.value
);
</script>

<template>
  <div
    v-if="showArticleInfo"
    class="article-info flex flex-wrap gap-x-5 gap-y-2.5 items-center pb-4 mb-7"
  >
    <ElyTooltip
      v-if="!frontmatter.meta?.hideEditTime"
      :content="`文章${hasPostUpdate ? '最后更新于 ' + lastUpdated : '创建于 ' + createdAt} (GMT+8)`"
      position="right"
      disable-hoverable-content
    >
      <span class="text-xs flex items-center gap-1.5 text-tertiary">
        <History
          v-if="hasPostUpdate"
          :size="13"
          :stroke-width="1.5"
          stroke-linecap="square"
        />
        <Timer v-else :size="13" :stroke-width="1.5" stroke-linecap="square" />
        <span>{{ createdAt }} (GMT+8)</span>
      </span>
    </ElyTooltip>
    <ElyTooltip
      v-if="!frontmatter.meta?.hideReadingTime"
      :content="`全文共 ${wordsCount} 字${imgCount ? `，${imgCount} 张图片` : ''}`"
      position="right"
      disable-hoverable-content
    >
      <span class="text-xs flex items-center gap-1.5 text-tertiary">
        <Timer :size="13" :stroke-width="1.5" stroke-linecap="square" />
        <span>阅读时间 {{ readingTime }} 分钟</span>
      </span>
    </ElyTooltip>
    <span v-if="frontmatter.tags?.length" class="flex flex-wrap gap-1.5">
      <ElyTag
        v-for="tag in frontmatter.tags"
        :key="tag"
        size="small"
        clickable
        @click="navigateToTag(tag)"
      >
        {{ tag }}
      </ElyTag>
    </span>
  </div>
</template>

<style scoped lang="scss">
.article-info {
  border-bottom: 1px solid var(--color-accent-border-200);
}
</style>
