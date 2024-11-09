<script setup lang="ts">
import { useData } from "vitepress";
import SearchTag from "./SearchTag.vue";
const { frontmatter, page } = useData();
import { useRoute, withBase } from "vitepress";
// @ts-ignore
import dayjs from "dayjs";
import { computed } from "vue";
import { getCreatedAt } from "../utils/getCreatedAt";

const lastUpdatedTimestamp = computed(() => page.value.lastUpdated);
const lastUpdated = computed(() =>
  lastUpdatedTimestamp.value
    ? dayjs(lastUpdatedTimestamp.value).format("YYYY-MM-DD hh:mm")
    : 0
);

const route = useRoute();
const currentPathWithoutBase = computed(
  () => "/" + route.path.replace(withBase("/"), "")
);

const createdAtTimestamp = computed(() =>
  getCreatedAt(currentPathWithoutBase.value)
);
const createdAt = computed(() =>
  createdAtTimestamp.value
    ? dayjs(createdAtTimestamp.value).format("YYYY-MM-DD HH:MM")
    : 0
);
</script>

<template>
  <div class="article-info flex flex-wrap gap-4">
    <div
      v-if="lastUpdated || createdAt"
      class="text-sm text-gray-500 @dark:text-gray-400"
    >
      <a-tooltip
        :content="
          lastUpdatedTimestamp !== createdAtTimestamp
            ? `文章创建于 ${createdAt}`
            : `文章最后更新于 ${lastUpdated}`
        "
        position="right"
      >
        <span>
          <icon-history v-if="lastUpdatedTimestamp && createdAtTimestamp" />
          <icon-clock-circle v-else />
          {{ lastUpdated || createdAt }}
        </span>
      </a-tooltip>
    </div>
    <div class="flex flex-wrap gap-2">
      <SearchTag v-for="tag in frontmatter?.tags" :tag="tag" size="small" />
    </div>
  </div>
</template>
