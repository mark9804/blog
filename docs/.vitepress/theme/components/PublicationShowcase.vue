<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useData } from "vitepress";
import { userProfile } from "../../configs/userProfile";
import { data as buildTimeData } from "../loaders/publications.data";
import type { ScholarData } from "../types/Publication";
import { fetchScholarData, getScholarEndpoint } from "../utils/scholarUtils";

const { theme } = useData();

const scholarData = ref<ScholarData>(buildTimeData);
const isRefreshing = ref(false);

const endpoint = computed(() =>
  getScholarEndpoint(theme.value?.userProfile?.meta ?? userProfile.meta)
);

const publications = computed(() => scholarData.value.publications);

onMounted(async () => {
  if (!endpoint.value) return;

  isRefreshing.value = true;
  const freshData = await fetchScholarData(endpoint.value);
  if (freshData && freshData.publications.length > 0) {
    scholarData.value = freshData;
  }
  isRefreshing.value = false;
});
</script>

<template>
  <div
    v-if="publications.length > 0"
    class="publication-showcase flex flex-col gap-4 my-6"
  >
    <article
      v-for="(pub, index) in publications"
      :key="`${pub.title}-${index}`"
      class="publication-item flex flex-col gap-2 p-4 rounded-[3px]"
    >
      <div class="publication-item__title font-bold text-base leading-snug">
        {{ pub.title }}
      </div>

      <div
        v-if="pub.authors.length > 0"
        class="publication-item__authors text-sm leading-relaxed"
      >
        <template
          v-for="(author, idx) in pub.authors"
          :key="`${author.name}-${idx}`"
        >
          <span v-if="idx > 0">, </span>
          <span
            :class="{
              'publication-item__author--self font-bold': author.isSelf,
            }"
          >
            {{ author.name }}
          </span>
        </template>
      </div>

      <div
        class="publication-item__meta flex flex-wrap items-center justify-between gap-2 text-xs"
      >
        <span class="publication-item__venue">{{ pub.venue }}</span>
        <div class="flex items-center gap-2 shrink-0">
          <span v-if="pub.citations > 0" class="publication-item__citations">
            Cited by {{ pub.citations }}
          </span>
          <span v-if="pub.year" class="publication-item__year font-bold">
            {{ pub.year }}
          </span>
        </div>
      </div>
    </article>
  </div>

  <div v-else-if="isRefreshing" class="flex items-center justify-center py-12">
    <ElySpinner size="32" stroke-width="3" />
  </div>

  <ElyEmptyState v-else class="py-12" />
</template>

<style lang="scss" scoped>
@use "../styles/colors" as *;

.publication-item {
  background-color: $color-accent-quinary;
  border-left: 3px solid $color-accent-tertiary;
  transition: all 0.25s ease-in-out;

  &:hover {
    background-color: $color-accent-quaternary;
    border-left-color: $color-accent;
  }

  &__title {
    color: $color-accent-text-primary;
  }

  &__authors {
    color: $color-accent-text-secondary;
  }

  &__author--self {
    color: $color-accent-text-primary;
    text-decoration: underline $color-accent-secondary 2px;
    text-underline-offset: 4px;
  }

  &__meta {
    color: $color-accent-text-tertiary;
  }

  &__citations,
  &__year {
    padding: 1px 6px;
    border-radius: 3px;
    background-color: $color-accent-quaternary;
    color: $color-accent-text-secondary;
  }
}
</style>
