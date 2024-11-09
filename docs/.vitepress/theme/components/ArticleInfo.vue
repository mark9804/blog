<script setup lang="ts">
import { useData } from "vitepress";
import SearchTag from "./SearchTag.vue";
const { frontmatter, page } = useData();
import { useRoute, withBase } from "vitepress";
import { computed, ref, onMounted } from "vue";
import { getCreatedAt } from "../utils/getCreatedAt";
import { formatDateTime } from "../utils/timeUtils";

const lastUpdatedTimestamp = computed(() => page.value.lastUpdated);
const lastUpdated = computed(() => formatDateTime(lastUpdatedTimestamp.value));

const route = useRoute();
const currentPathWithoutBase = computed(
  () => "/" + route.path.replace(withBase("/"), "")
);

const createdAtTimestamp = ref(0);

async function fetchCreatedAtTimestamp() {
  const res = await getCreatedAt(currentPathWithoutBase.value);
  createdAtTimestamp.value = res;
}

onMounted(() => {
  fetchCreatedAtTimestamp();
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
  <div class="article-info flex flex-wrap gap-4">
    <div
      v-if="lastUpdated || createdAt"
      class="text-sm text-gray-500 @dark:text-gray-400"
    >
      <a-tooltip
        :content="`文章${hasPostNotUpdated ? '' : '初稿'}创建于 ${createdAt} (GMT+8)`"
        position="right"
      >
        <span>
          <icon-clock-circle v-if="hasPostNotUpdated" />
          <icon-history v-else />
          {{ lastUpdated || createdAt }} (GMT+8)
        </span>
      </a-tooltip>
    </div>
    <div class="flex flex-wrap gap-2">
      <SearchTag v-for="tag in frontmatter?.tags" :tag="tag" size="small" />
    </div>
  </div>
</template>
