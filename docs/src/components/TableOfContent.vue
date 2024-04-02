<script setup lang="ts">
import { ArticleInfo } from "../types/ArticleInfo";

const props = withDefaults(
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
  <div class="toc-list">
    <a class="toc-list__title--link" :href="content.url.slice(1)">{{
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
        <span
          v-for="series in content.frontmatter.series"
          class="toc-list__categories__series--series"
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
          :key="tag"
          class="toc-list__categories__tags--tag"
        >
          <span>{{ tag }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.toc-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
  padding: 1rem;

  &__title--link {
    font-size: 1.25rem;
    color: var(--vp-c-brand-1);
    text-decoration: none;
    transition: color 0.3s;
    font-weight: 700;
    font-family: "Wix Madefor Display", var(--vp-font-family-base);

    &:hover {
      color: var(--vp-c-brand-2);
    }
  }

  &__description {
    margin: 0;
    font-size: 14px;
    line-height: 1;
    color: var(--color-text-3);
  }

  &__categories {
    display: flex;
    gap: 0.5rem;

    &__series {
      display: flex;
      gap: 0.5rem;

      &--series {
        font-size: 14px;
        line-height: 1.2;
        color: var(--color-text-3);
        background-color: var(--color-bg-2);
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        color: var(--vp-c-brand-1);
        background-color: var(--arona-blue-1);
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
        border-radius: 0.25rem;

        &::before {
          content: "\e865";
          font-family: "Material Symbols Outlined";
        }
      }
    }

    &__tags {
      display: flex;
      gap: 0.5rem;

      &--tag {
        font-size: 14px;
        line-height: 1.2;
        color: var(--vp-c-brand-1);
        background-color: var(--arona-blue-1);
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
        border-radius: 0.25rem;

        &::before {
          content: "\f05b";
          font-family: "Material Symbols Outlined";
        }
      }
    }
  }
}
</style>
