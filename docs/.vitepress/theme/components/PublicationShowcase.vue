<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useData } from "vitepress";
import { Calendar, Quote } from "@lucide/vue";
import { data as buildTimeData } from "../loaders/publications.data";
import type { ScholarData } from "../types/Publication";
import { fetchScholarData } from "../utils/scholarUtils";
import ElyCard from "./ElysiumUI/ElyCard.vue";
import ElyEmptyState from "./ElysiumUI/ElyEmptyState.vue";
import ElySpinner from "./ElysiumUI/ElySpinner.vue";
import ElyTag from "./ElysiumUI/ElyTag.vue";

const CACHE_KEY = "elysium:openalex-scholar:v1";
const CACHE_TTL_MS = 30 * 60 * 1000;

interface CachedScholarPayload {
  timestamp: number;
  data: ScholarData;
}

const { theme } = useData();

const scholarData = ref<ScholarData>(buildTimeData);
const isRefreshing = ref(false);

const scholarConfig = computed(() => theme.value?.userProfile?.scholar);

const publications = computed(() => scholarData.value.publications);

function readSessionCache(): ScholarData | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedScholarPayload;
    if (
      Date.now() - parsed.timestamp < CACHE_TTL_MS &&
      Array.isArray(parsed.data?.publications) &&
      parsed.data.publications.length > 0
    ) {
      return parsed.data;
    }
  } catch {
    // Ignore storage errors in restricted browser contexts
  }
  return null;
}

function writeSessionCache(data: ScholarData) {
  try {
    const payload: CachedScholarPayload = {
      timestamp: Date.now(),
      data,
    };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage errors
  }
}

onMounted(async () => {
  if (!scholarConfig.value) return;

  const cached = readSessionCache();
  if (cached) {
    scholarData.value = cached;
    return;
  }

  isRefreshing.value = true;
  const freshData = await fetchScholarData(scholarConfig.value);
  if (freshData && freshData.publications.length > 0) {
    scholarData.value = freshData;
    writeSessionCache(freshData);
  }
  isRefreshing.value = false;
});
</script>

<template>
  <div
    v-if="publications.length > 0"
    class="publication-showcase vp-raw flex flex-col gap-7 my-8"
  >
    <ElyCard
      v-for="pub in publications"
      :key="pub.id"
      max-width="100%"
      :href="pub.url"
      :aria-label="pub.title"
      :external="Boolean(pub.url)"
    >
      <template #title>
        <a
          v-if="pub.url"
          :href="pub.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ pub.title }}
        </a>
        <span v-else>{{ pub.title }}</span>
      </template>

      <template #meta>
        <div
          v-if="pub.authors.length > 0"
          class="publication-showcase__authors pt-2 text-sm leading-relaxed"
        >
          <template
            v-for="(author, idx) in pub.authors"
            :key="`${author.name}-${idx}`"
          >
            <span v-if="idx > 0">, </span>
            <span
              :class="{
                'publication-showcase__author--self': author.isSelf,
              }"
            >
              {{ author.name }}
            </span>
          </template>
        </div>
      </template>

      <template #footer>
        <div
          class="w-full flex flex-wrap items-center justify-between gap-2 text-xs"
        >
          <span class="publication-showcase__venue">{{ pub.venue }}</span>
          <div class="flex items-center gap-1.5 shrink-0">
            <ElyTag v-if="pub.citations > 0" size="small">
              <template #icon>
                <Quote :size="10" :stroke-width="1.75" />
              </template>
              Cited by {{ pub.citations }}
            </ElyTag>
            <ElyTag
              v-if="pub.year"
              size="small"
              class="publication-showcase__year"
            >
              <template #icon>
                <Calendar :size="10" :stroke-width="1.75" />
              </template>
              {{ pub.year }}
            </ElyTag>
          </div>
        </div>
      </template>
    </ElyCard>
  </div>

  <div v-else-if="isRefreshing" class="flex items-center justify-center py-12">
    <ElySpinner :size="32" label="LOADING PUBLICATIONS" />
  </div>

  <ElyEmptyState v-else class="py-12" />
</template>

<style lang="scss" scoped>
.publication-showcase {
  &__authors {
    font-family: var(--font-family-base);
    color: var(--color-accent-text-secondary);
  }

  &__author--self {
    font-weight: 600;
    color: var(--gouache-ink);
    text-decoration: underline var(--gouache-pigment) 1.5px;
    text-underline-offset: 4px;
  }

  &__venue {
    font-family: var(--font-family-base);
    color: var(--color-accent-text-tertiary);
  }

  &__year :deep(.elysium-ui__tag--content),
  &__year :deep(.elysium-ui__tag--icon) {
    color: var(--gouache-ink);
  }
}
</style>
