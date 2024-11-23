<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import type { CardProps } from "./types/CardProps";
import { withBase } from "vitepress";
import { formatRelativeTime } from "../../utils/timeUtils";
import { useSearchTags } from "../../utils/tagSearchUtils";
import { useCustomStore } from "../../../piniaStore";

const store = useCustomStore();

const props = withDefaults(defineProps<CardProps>(), {
  content: () => ({
    url: "",
    createdAt: 0,
    readingTime: 0,
    wordsCount: 0,
    imgCount: 0,
    src: "",
    html: "",
    frontmatter: {
      title: "",
      description: "",
      link: "",
      cover: "",
      tags: [],
    },
    excerpt: "",
  }),
  maxWidth: 280,
  as: "card",
});

const isLink = computed(() => props.as === "link");

function handleTagClick(tag: string) {
  store.resetTags();
  store.pushSelectedTags(tag);
  useSearchTags.go();
}

const relativeTime = ref(formatRelativeTime(props.content.createdAt));

let timer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  timer = setInterval(() => {
    relativeTime.value = formatRelativeTime(props.content.createdAt);
  }, 60000); // 每分钟更新一次 relativeTime
});

onUnmounted(() => {
  if (timer !== null) {
    clearInterval(timer);
  }
});
</script>

<template>
  <component
    :is="isLink ? 'a' : 'div'"
    class="elysium-ui__card__container rounded-[3px] overflow-hidden shadow-card hover:shadow-card-hover hover:scale-102 transition-all duration-300 relative"
    :class="{
      'no-cover': !props.content.frontmatter.cover,
    }"
    :style="{
      maxWidth: `${props.maxWidth}px`,
    }"
    :href="isLink && withBase(props.content.url)"
  >
    <a
      v-if="props.content.url"
      :href="withBase(props.content.url)"
      :alt="`阅读文章：${props.content.frontmatter.title}`"
      :title="`阅读文章：${props.content.frontmatter.title}`"
      class="absolute inset-0 w-full h-full z-0"
    />
    <img
      v-if="props.content.frontmatter.cover"
      :src="props.content.frontmatter.cover"
      :alt="props.content.frontmatter.title"
    />
    <div class="elysium-ui__card--content flex flex-col pb-4">
      <h2 class="elysium-ui__card--title font-bold text-lg pt-4 pl-4 pr-4">
        {{ props.content.frontmatter.title }}
      </h2>
      <ElySpace
        :size="2"
        divider="・"
        wrap
        class="pt-1 pl-4 pr-4 text-tertiary text-xs"
      >
        <span>{{ relativeTime }}</span>
        <span>{{ props.content.wordsCount }} 字{{}}</span>
        <span v-if="props.content.imgCount > 0"
          >{{ props.content.imgCount }} 张图片</span
        >
        <span>{{ props.content.readingTime }} 分钟读完</span>
      </ElySpace>
      <p
        v-if="props.content.frontmatter.description"
        class="elysium-ui__card--description text-tertiary pt-4 pl-4 pr-4 text-sm"
      >
        {{ props.content.frontmatter.description }}
      </p>
      <div class="elysium-ui__card--tags flex flex-wrap gap-2 pt-4 pl-4 pr-4">
        <ElyTag
          v-for="tag in props.content.frontmatter.tags"
          :key="tag"
          class="z-1"
          :id="tag"
          :title="`搜索含有「${tag}」标签的文章`"
          size="small"
          clickable
          @click="handleTagClick(tag)"
        >
          {{ tag }}
        </ElyTag>
      </div>
    </div>
  </component>
</template>

<style scoped lang="scss">
@use "../../styles/color-variable" as colors;

.elysium-ui__card {
  &__container {
    width: 100%;
    display: grid;
    grid-template-areas:
      "cover"
      "content";
    background-color: colors.$color-accent-base;

    &.no-cover {
      grid-template-areas: "content";
    }
  }

  &--cover {
    grid-area: cover;
  }

  &--content {
    grid-area: content;
  }
}
</style>
