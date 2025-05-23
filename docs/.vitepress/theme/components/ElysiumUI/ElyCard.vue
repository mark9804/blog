<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, nextTick } from "vue";
import type { CardProps } from "./types/CardProps";
import { withBase } from "vitepress";
import { formatRelativeTime, getUpdateInterval } from "../../utils/timeUtils";
import { useSearchTags } from "../../utils/tagSearchUtils";
import { useCustomStore } from "../../../stores/piniaStore";
import { formalizeString } from "./_utils/stringUtils";

const store = useCustomStore();

const emit = defineEmits<{
  (e: "loaded"): void; // 图片加载完成
  (e: "suspense"): void; // 图片加载时间过长
}>();

const isLoaded = ref(false);
const isVisible = ref(false);
const imageLoaded = ref(false);

const handleImageLoad = () => {
  imageLoaded.value = true;
  isLoaded.value = true;
  emit("loaded");
};

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

const minWidth = computed(() => Math.min(props.maxWidth, 280));
const maxWidth = computed(() => Math.max(props.maxWidth, 280));

function handleTagClick(tag: string) {
  store.resetTags();
  store.pushSelectedTags(tag);
  useSearchTags.go();
}

const relativeTime = ref(formatRelativeTime(props.content.createdAt));

let timer: ReturnType<typeof setInterval> | null = null;

// 根据时间单位设置不同的更新频率
function setupTimeUpdateInterval() {
  // 清除现有的定时器
  if (timer !== null) {
    clearInterval(timer);
  }

  // 获取合适的更新间隔
  const updateInterval = getUpdateInterval(props.content.createdAt);

  // 设置新的定时器
  timer = setInterval(() => {
    relativeTime.value = formatRelativeTime(props.content.createdAt);
    // 更新后重新检查是否需要调整更新频率
    setupTimeUpdateInterval();
  }, updateInterval);
}

onMounted(async () => {
  // 初始设置更新频率
  setupTimeUpdateInterval();

  await nextTick(); // 先等待 DOM 更新
  // 如果没有封面图片，则直接认为图片加载完成
  if (!props.content.frontmatter.cover) {
    isLoaded.value = true;
    emit("loaded");
  } else {
    // 如果存在封面图片，延时判断，如果没加载完成发送 suspense 事件避免阻塞
    setTimeout(() => {
      if (!isLoaded.value) {
        emit("suspense");
      }
    }, 1000);
  }
  // 添加一个小延迟，平滑淡入效果
  requestAnimationFrame(() => {
    isVisible.value = true;
  });
});

onUnmounted(() => {
  if (timer !== null) {
    clearInterval(timer);
  }
});

const shouldAriaLabelHide = ref(false);
</script>

<template>
  <component
    :is="isLink ? 'a' : 'div'"
    class="elysium-ui__card__container w-full grid rounded-[3px] overflow-hidden hover:shadow-card-hover hover:scale-102 transition-all duration-500 relative"
    :class="{
      'no-cover': !props.content.frontmatter.cover,
      'opacity-0': !isVisible,
      'opacity-100': isVisible,
    }"
    :style="{
      minWidth: `${minWidth}px`,
      maxWidth: `${maxWidth}px`,
    }"
    :href="isLink && withBase(props.content.url)"
  >
    <a
      v-if="props.content.url"
      :href="withBase(props.content.url)"
      class="absolute inset-0 w-full h-full z-1"
      tabindex="-1"
      :aria-hidden="shouldAriaLabelHide"
      :aria-label="`Read more about ${props.content.frontmatter.title}`"
      @mouseover="shouldAriaLabelHide = false"
      @mouseleave="shouldAriaLabelHide = true"
    />
    <div class="elysium-ui__card--content flex flex-col pb-4">
      <div
        class="elysium-ui__card--cover-container z-0 relative w-full h-full overflow-hidden"
        v-if="props.content.frontmatter.cover"
      >
        <img
          class="elysium-ui__card--cover w-full block object-cover transition-opacity duration-500"
          :class="{ loaded: imageLoaded }"
          :src="props.content.frontmatter.cover"
          :alt="props.content.frontmatter.title"
          :aria-label="`文章「${props.content.frontmatter.title}」的封面图片`"
          @load="handleImageLoad"
          @error="emit('suspense')"
          loading="eager"
        />
      </div>
      <h2 class="elysium-ui__card--title font-bold text-lg pt-4 pl-4 pr-4">
        <a :href="withBase(props.content.url)">
          {{ formalizeString(props.content.frontmatter.title) }}
        </a>
      </h2>
      <ElySpace
        :size="0"
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
          class="z-2"
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
@use "../../styles/colors";

.elysium-ui__card {
  &__container {
    grid-template-areas:
      "cover"
      "content";
    background-color: colors.$color-accent-base;

    &.no-cover {
      grid-template-areas: "content";
    }
  }

  &--cover-container {
    grid-area: cover;
    background-color: colors.$color-accent-base;
  }

  &--cover {
    opacity: 0;

    &.loaded {
      opacity: 1;
    }
  }

  &--content {
    grid-area: content;
  }
}
</style>
