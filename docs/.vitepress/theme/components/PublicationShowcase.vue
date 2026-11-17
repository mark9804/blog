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
    class="publication-showcase flex flex-col gap-7 my-8"
  >
    <article
      v-for="(pub, index) in publications"
      :key="`${pub.title}-${index}`"
      class="publication-item relative"
    >
      <!-- Layer 0: Same-size matte gouache plane offset by (4px, 4px) -->
      <span aria-hidden="true" class="publication-item__gouache-plane" />

      <!-- Layer 1: Closed drafting perimeter with diagonal overhanging crosshairs -->
      <div
        aria-hidden="true"
        class="publication-item__crosshairs pointer-events-none absolute inset-0 z-1"
      >
        <span class="pub-crosshair pub-crosshair--top" />
        <span class="pub-crosshair pub-crosshair--left" />
        <span class="pub-crosshair pub-crosshair--bottom" />
        <span class="pub-crosshair pub-crosshair--right" />
      </div>

      <!-- Layer 2: Publication metadata & hollow negative-space badges -->
      <div
        class="publication-item__content relative z-1 flex flex-col gap-2 p-5"
      >
        <div class="publication-item__title leading-snug">
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
                'publication-item__author--self': author.isSelf,
              }"
            >
              {{ author.name }}
            </span>
          </template>
        </div>

        <div
          class="publication-item__meta flex flex-wrap items-center justify-between gap-2 pt-1 text-xs"
        >
          <span class="publication-item__venue">{{ pub.venue }}</span>
          <div class="flex items-center gap-2 shrink-0">
            <span v-if="pub.citations > 0" class="publication-item__badge">
              Cited by {{ pub.citations }}
            </span>
            <span
              v-if="pub.year"
              class="publication-item__badge publication-item__badge--year"
            >
              {{ pub.year }}
            </span>
          </div>
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
.publication-item {
  background-color: transparent;

  &:hover {
    .pub-crosshair {
      background-color: var(--color-accent-border-600);
    }

    .publication-item__gouache-plane {
      transform: translate3d(6px, 6px, 0);
      background-color: var(--gouache-wash);
    }

    .publication-item__title {
      color: var(--color-accent);
    }
  }

  &__gouache-plane {
    position: absolute;
    inset: 0;
    background-color: color-mix(
      in srgb,
      var(--gouache-wash) 72%,
      var(--gouache-paper)
    );
    transform: translate3d(4px, 4px, 0);
    pointer-events: none;
    z-index: 0;
    transition:
      transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
      background-color 0.25s ease;
  }

  &__title {
    font-family: var(--font-family-serif);
    font-weight: 600;
    font-size: 1.125rem;
    letter-spacing: 0.01em;
    color: var(--gouache-ink);
    transition: color 0.25s ease;
  }

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

  &__meta {
    font-family: var(--font-family-base);
    color: var(--color-accent-text-tertiary);
  }

  // Hollow paper cutouts matching card tags
  &__badge {
    padding: 1px 8px;
    background-color: var(--gouache-paper);
    color: var(--color-accent);
    font-weight: 500;

    &--year {
      color: var(--gouache-ink);
    }
  }
}

.pub-crosshair {
  position: absolute;
  background-color: var(--color-accent-border-200);
  transition: background-color 0.25s ease;

  &--top {
    top: 0;
    left: -9px;
    right: 0;
    height: 1px;
  }

  &--left {
    top: -9px;
    left: 0;
    bottom: 0;
    width: 1px;
  }

  &--bottom {
    bottom: 0;
    left: 0;
    right: -9px;
    height: 1px;
  }

  &--right {
    top: 0;
    right: 0;
    bottom: -9px;
    width: 1px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .publication-item__gouache-plane,
  .pub-crosshair {
    transition: none !important;
  }
}
</style>
