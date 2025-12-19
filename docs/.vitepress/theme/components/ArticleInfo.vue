<script setup lang="ts">
import { useData, useRoute, withBase } from "vitepress";
import { computed } from "vue";
import { postData } from "../utils/usePostData";
import { formatDateTime } from "../utils/timeUtils";
import { AlarmClock } from "@icon-park/vue-next";
import { useSearchTags } from "../utils/tagSearchUtils";
import { useCustomStore } from "../../stores/piniaStore";

const store = useCustomStore();
const { frontmatter, page, isDark } = useData();
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
    class="article-info flex flex-wrap gap-4 items-center mb-5"
    v-if="!frontmatter?.meta?.hideArticleInfo"
  >
    <a-tooltip
      v-if="lastUpdated || createdAt || !frontmatter?.meta?.hideEditTime"
      :content="`文章${hasPostUpdate ? '最后更新于' + lastUpdated : '创建于' + createdAt} (GMT+8)`"
      position="right"
    >
      <span
        class="text-sm flex items-center gap-1 text-gray-500 dark:text-gray-400"
        v-if="!frontmatter?.meta?.hideEditTime"
      >
        <icon-history v-if="hasPostUpdate" />
        <icon-clock-circle v-else />
        {{ createdAt }} (GMT+8)
      </span>
    </a-tooltip>
    <a-tooltip
      :content="`全文共 ${wordsCount} 字${imgCount ? `， ${imgCount} 张图片` : ''}`"
      position="right"
    >
      <span
        class="text-sm flex items-center gap-1 text-gray-500 dark:text-gray-400"
        v-if="!frontmatter?.meta?.hideReadingTime"
      >
        <alarm-clock
          theme="outline"
          size="14"
          :color="isDark ? '#9ca3af' : '#6b7280'"
        />阅读时间 {{ readingTime }} 分钟
      </span>
    </a-tooltip>
    <span v-if="frontmatter?.tags?.length" class="flex flex-wrap gap-2">
      <ElyTag
        v-for="tag in frontmatter?.tags"
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
