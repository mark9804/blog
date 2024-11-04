<script setup lang="ts">
import { ArticleInfo } from "../types/ArticleInfo";
import { useRouter, withBase } from "vitepress";
import { computed } from "vue";
import { ViewGridDetail } from "@icon-park/vue-next";
const props = withDefaults(
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

function searchTags(tag: string) {
  router.go(withBase(`/tags/?keyword=${encodeURIComponent(tag)}`));
}

const hasCover = computed(() => !!props.content.frontmatter.cover);
</script>

<template>
  <div
    class="toc-container grid mb-2 border-1 border-fill border-solid rounded-lg overflow-hidden"
  >
    <div
      v-if="hasCover"
      class="toc-container__cover pointer-events-none absolute h-full w-full overflow-hidden z-[-1] rounded-lg overflow-hidden top-0 left-0"
    >
      <img
        class="toc-container__cover--img object-cover w-full h-full block align-bottom"
        :src="content.frontmatter.cover"
      />
    </div>
    <a class="toc-container--link" :href="content.url.slice(1)"></a>

    <div
      class="toc-list flex flex-col gap-2 p-3 pl-4 w-fit pointer-events-none"
      :class="{ 'has-cover': hasCover }"
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
      <div
        class="toc-list__info text-xs text-3 select-none flex items-center gap-1"
      >
        <view-grid-detail :fill="hasCover ? '#fff' : '#86909c'" size="12" />
        <!-- <icon-info-circle /> -->
        <span
          >{{ content.wordsCount }} 字<span v-if="!!content.imgCount"
            >，{{ content.imgCount }} 张图片</span
          ></span
        >
        <span>|</span>
        <!-- <hourglass-full fill="#86909c" size="10" /> -->
        <span>全部读完约 {{ content.readingTime }} 分钟</span>
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
  position: relative; // stacking context

  &--link,
  &__cover {
    grid-area: placeholder;
  }

  &__cover::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(29, 33, 41, 0.75) 0%,
      rgba(29, 33, 41, 0) 100%
    );
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

  .has-cover &__title,
  .has-cover &__info {
    color: #ffffff;
  }
}
</style>
