<script setup lang="ts">
import { ArticleInfo } from "../types/ArticleInfo";

withDefaults(
  defineProps<{
    content: ArticleInfo;
  }>(),
  {
    content: {
      frontmatter: {
        title: "无题",
        description: "",
        series: [],
        tags: [],
      },
      url: "",
    },
  }
);
</script>

<template>
  <div class="toc-container">
    <a class="toc-container--link" :href="content.url.slice(1)"></a>
    <div class="toc-list">
      <a class="toc-list__title" :href="content.url.slice(1)">{{
        content.frontmatter.title
      }}</a>
      <p class="toc-list__description" v-if="content.frontmatter.description">
        {{ content.frontmatter.description }}
      </p>
      <div class="toc-list__categories">
        <div
          class="toc-list__categories__series"
          v-if="
            content.frontmatter.series && content.frontmatter.series.length > 0
          "
        >
          <!-- eslint-disable vue/require-v-for-key -->
          <span
            v-for="series in content.frontmatter.series"
            class="toc-list__categories__series span-series"
          >
            {{ series.name }}-{{ (series.part + "").padStart(2, "0") }}
          </span>
        </div>
        <div
          class="toc-list__categories__tags"
          v-if="content.frontmatter.tags && content.frontmatter.tags.length > 0"
        >
          <div
            v-for="tag in content.frontmatter.tags"
            class="toc-list__categories__tags span-tag"
          >
            <!-- eslint-enable vue/require-v-for-key -->
            <span>{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
a {
  text-decoration: none;
  color: inherit;
}

.toc-container {
  display: grid;
  grid-template-areas: "placeholder";
  border-radius: 0.5rem;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
  overflow: hidden;

  &--link {
    grid-area: placeholder;
  }
}

.toc-list {
  grid-area: placeholder;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  width: 100%;
  width: fit-content;
  pointer-events: none;

  &__title {
    width: 100%;
    border: none;
    margin: 0;
    padding: 0;
    font-size: 1.25rem;
    color: var(--vp-c-brand-1);
    transition: color 0.3s;
    font-weight: 700;
    font-family: "Wix Madefor Display", var(--vp-font-family-base);

    &:hover {
      color: var(--vp-c-brand-2);
    }
  }

  &__description {
    width: fit-content;
    margin: 0;
    font-size: 14px;
    line-height: 1;
    color: var(--color-text-3);
    pointer-events: auto;
  }

  &__categories {
    width: fit-content;
    display: flex;
    gap: 0.5rem;

    &__series {
      width: fit-content;
      display: flex;
      gap: 0.5rem;
    }

    &__tags {
      width: fit-content;
      display: flex;
      gap: 0.5rem;
    }
  }
}
</style>
