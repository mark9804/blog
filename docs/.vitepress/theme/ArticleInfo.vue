<script setup lang="ts">
import { useData } from "vitepress";
import SearchTag from "./SearchTag.vue";
const { frontmatter, page } = useData();
// @ts-ignore
import dayjs from "dayjs";
import { computed } from "vue";

const timestamp = computed(() => page.value.lastUpdated);

const lastUpdated = computed(() =>
  !!timestamp.value ? dayjs(timestamp.value).format("YYYY-MM-DD HH:mm") : null
);
</script>

<template>
  <div class="article-info flex flex-wrap gap-4">
    <div v-if="lastUpdated" class="text-sm text-gray-500 @dark:text-gray-400">
      <icon-clock-circle /> {{ lastUpdated }}
    </div>
    <div class="flex flex-wrap gap-2">
      <SearchTag v-for="tag in frontmatter?.tags" :tag="tag" size="small" />
    </div>
  </div>
</template>
