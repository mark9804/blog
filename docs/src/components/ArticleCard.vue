<script setup lang="ts">
import { ArticleInfo } from "../types/ArticleInfo";
import { useRouter } from "vitepress";
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

const router = useRouter();

const baseUrl = "/blog/";

function searchTags(tag: string) {
  router.go(`${baseUrl}tags/?keyword=${encodeURIComponent(tag)}`);
}
</script>

<template>
  <div
    class="toc-container grid mb-2 border-1 border-fill border-solid rounded-lg overflow-hidden"
  >
    <a class="toc-container--link" :href="content.url.slice(1)"></a>
    <div
      class="toc-list flex flex-col gap-2 p-3 pl-4 w-fit pointer-events-none"
    >
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
          @click="searchTags(tag)"
          v-for="tag in content.frontmatter.tags"
          class="pointer-events-auto cursor-pointer"
        >
          <!-- eslint-enable vue/valid-v-for -->
          <template #icon>
            <icon-tag />
          </template>
          <span>{{ tag }}</span>
        </a-tag>
      </div>
      <p class="text-xs text-3 select-none">
        <icon-clock-circle />
        {{ content.wordsCount }} 字 | {{ content.readingTime }} 分钟
      </p>
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
