<script setup lang="ts">
import { useData } from "vitepress";
import SearchTag from "./SearchTag.vue";
import { useRoute, withBase } from "vitepress";
import { computed, ref, onMounted } from "vue";
import { postData } from "../../utils/usePostData";
import { formatDateTime } from "../../utils/timeUtils";
import { AlarmClock } from "@icon-park/vue-next";

const { frontmatter, page, isDark } = useData();

const lastUpdatedTimestamp = computed(() => page.value.lastUpdated);
const lastUpdated = computed(() => formatDateTime(lastUpdatedTimestamp.value));

const route = useRoute();
const currentPathWithoutBase = computed(
  () => "/" + route.path.replace(withBase("/"), "")
);

const createdAtTimestamp = ref(0);
const readingTime = ref(0);
const wordsCount = ref(0);
const imgCount = ref(0);

async function fetchPostData() {
  const [createdAt, reading, words, images] = await Promise.all([
    postData.getCreatedAt(currentPathWithoutBase.value),
    postData.getReadingTime(currentPathWithoutBase.value),
    postData.getWordsCount(currentPathWithoutBase.value),
    postData.getImgCount(currentPathWithoutBase.value),
  ]);

  createdAtTimestamp.value = createdAt;
  readingTime.value = reading;
  wordsCount.value = words;
  imgCount.value = images;
}

onMounted(() => {
  fetchPostData();
});

const createdAt = computed(() => formatDateTime(createdAtTimestamp.value));

const hasPostNotUpdated = computed(
  () =>
    lastUpdatedTimestamp.value &&
    createdAtTimestamp.value &&
    lastUpdatedTimestamp.value === createdAtTimestamp.value
);
</script>

<template>
  <div class="article-info flex flex-wrap gap-4 items-center">
    <a-tooltip
      v-if="lastUpdated || createdAt"
      :content="`文章${hasPostNotUpdated ? '' : '初稿'}创建于 ${createdAt} (GMT+8)`"
      position="right"
    >
      <span
        class="text-sm flex items-center gap-1 text-gray-500 dark:text-gray-400"
      >
        <icon-clock-circle v-if="hasPostNotUpdated" />
        <icon-history v-else />
        {{ lastUpdated || createdAt }} (GMT+8)
      </span>
    </a-tooltip>
    <a-tooltip
      :content="`全文共 ${wordsCount} 字${imgCount ? `， ${imgCount} 张图片` : ''}`"
      position="right"
    >
      <span
        class="text-sm flex items-center gap-1 text-gray-500 dark:text-gray-400"
      >
        <alarm-clock
          theme="outline"
          size="14"
          :color="isDark ? '#9ca3af' : '#6b7280'"
        />阅读时间 {{ readingTime }} 分钟
      </span>
    </a-tooltip>
    <span v-if="frontmatter?.tags?.length" class="flex flex-wrap gap-2">
      <SearchTag v-for="tag in frontmatter?.tags" :tag="tag" size="small" />
    </span>
  </div>
</template>
