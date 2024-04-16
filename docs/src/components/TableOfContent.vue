<script setup lang="ts">
import { ArticleInfo } from "../types/ArticleInfo";
import { IconTag } from "@arco-design/web-vue/es/icon";
withDefaults(
  defineProps<{
    content: ArticleInfo;
  }>(),
  {
    content: {
      // @ts-ignore
      frontmatter: {
        title: "无题",
        description: "",
        tags: [],
      },
      url: "",
    },
  }
);
</script>

<template>
  <div class="toc-container grid shadow-std rounded-lg overflow-hidden">
    <a class="toc-container--link" :href="content.url.slice(1)"></a>
    <div class="toc-list flex flex-col gap-2 p-4 w-fit pointer-events-none">
      <a
        class="toc-list__title w-full border-none m-0 p-0 text-xl font-700"
        :href="content.url.slice(1)"
        >{{ content.frontmatter.title }}</a
      >
      <p
        class="text-3 w-fit m-0 text-sm pointer-events-auto"
        v-if="content.frontmatter.description"
      >
        {{ content.frontmatter.description }}
      </p>
      <div
        class="flex gap-2"
        v-if="content.frontmatter.tags && content.frontmatter.tags.length > 0"
      >
        <a-tag
          color="arcoblue"
          v-for="tag in content.frontmatter.tags"
          class="pointer-events-auto"
        >
          <!-- eslint-enable vue/valid-v-for -->
          <template #icon>
            <icon-tag />
          </template>
          <span>{{ tag }}</span>
        </a-tag>
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
  grid-template-areas: "placeholder";

  &--link {
    grid-area: placeholder;
  }
}

.toc-list {
  grid-area: placeholder;

  &__title {
    color: var(--vp-c-brand-1);
    transition: color 0.3s;
    font-family: "Wix Madefor Display", var(--vp-font-family-base);

    &:hover {
      color: var(--vp-c-brand-2);
    }
  }
}
</style>
