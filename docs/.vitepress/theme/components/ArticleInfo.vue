<script setup lang="ts">
import { useData, useRoute, withBase } from "vitepress";
import { computed } from "vue";
import { postData } from "../utils/usePostData";
import { formatDateTime } from "../utils/timeUtils";
import { Timer, History } from "@lucide/vue";
import { useSearchTags } from "../utils/tagSearchUtils";
import { useCustomStore } from "../../stores/piniaStore";

const store = useCustomStore();
const { frontmatter, page } = useData();
const route = useRoute();

const currentPathWithoutBase = computed(
  () => "/" + route.path.replace(withBase("/"), "")
);

const currentPost = computed(() =>
  postData.getPost(currentPathWithoutBase.value)
);

const createdAtTimestamp = computed(() => currentPost.value?.createdAt ?? 0);
const readingTime = computed(() => currentPost.value?.readingTime ?? 0);
const wordsCount = computed(() => currentPost.value?.wordsCount ?? 0);
const imgCount = computed(() => currentPost.value?.imgCount ?? 0);

const lastUpdatedTimestamp = computed(() => page.value.lastUpdated ?? 0);
const lastUpdated = computed(() => formatDateTime(lastUpdatedTimestamp.value));
const createdAt = computed(() =>
  formatDateTime(createdAtTimestamp.value || new Date().getTime())
);

const hasPostUpdate = computed(
  () =>
    0 !== (lastUpdatedTimestamp.value ?? 0) &&
    createdAtTimestamp.value &&
    lastUpdatedTimestamp.value !== createdAtTimestamp.value
);

function handleTagClick(tag: string) {
  store.resetTags();
  store.pushSelectedTags(tag);
  useSearchTags.go();
}
</script>

<template>
  <div
    class="article-info flex flex-wrap gap-x-5 gap-y-2.5 items-center pb-4 mb-7"
    v-if="!frontmatter?.meta?.hideArticleInfo"
  >
    <ElyTooltip
      v-if="lastUpdated || createdAt || !frontmatter?.meta?.hideEditTime"
      :content="`文章${hasPostUpdate ? '最后更新于 ' + lastUpdated : '创建于 ' + createdAt} (GMT+8)`"
      position="right"
      disable-hoverable-content
    >
      <span
        class="text-xs flex items-center gap-1.5 text-tertiary"
        v-if="!frontmatter?.meta?.hideEditTime"
      >
        <History
          :size="13"
          :stroke-width="1.5"
          stroke-linecap="square"
          v-if="hasPostUpdate"
        />
        <Timer :size="13" :stroke-width="1.5" stroke-linecap="square" v-else />
        <span>{{ createdAt }} (GMT+8)</span>
      </span>
    </ElyTooltip>
    <ElyTooltip
      :content="`全文共 ${wordsCount} 字${imgCount ? `，${imgCount} 张图片` : ''}`"
      position="right"
      disable-hoverable-content
    >
      <span
        class="text-xs flex items-center gap-1.5 text-tertiary"
        v-if="!frontmatter?.meta?.hideReadingTime"
      >
        <Timer :size="13" :stroke-width="1.5" stroke-linecap="square" />
        <span>阅读时间 {{ readingTime }} 分钟</span>
      </span>
    </ElyTooltip>
    <span v-if="frontmatter?.tags?.length" class="flex flex-wrap gap-1.5">
      <ElyTag
        v-for="tag in frontmatter?.tags"
        :key="tag"
        size="small"
        :id="tag"
        clickable
        @click="handleTagClick(tag)"
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
