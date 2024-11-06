<script setup lang="ts">
import { useData } from "vitepress";
import SearchTag from "./SearchTag.vue";
const { frontmatter, page } = useData();
import dayjs from "dayjs";
import { computed } from "vue";

const lastUpdated = computed(() =>
  dayjs(page.value.lastUpdated).format("YYYY-MM-DD HH:mm")
);
</script>

<template>
  <div class="article-info flex flex-wrap gap-4">
    <div class="text-sm text-gray-500 @dark:text-gray-400">
      <icon-clock-circle /> {{ lastUpdated }}
    </div>
    <div class="flex flex-wrap gap-2">
      <SearchTag v-for="tag in frontmatter?.tags" :tag="tag" size="small" />
    </div>
  </div>
</template>
