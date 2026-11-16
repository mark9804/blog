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
  (e: "loaded"): void;
  (e: "suspense"): void;
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

function handleTagClick(tag: string) {
  store.resetTags();
  store.pushSelectedTags(tag);
  useSearchTags.go();
}

const relativeTime = ref(
  formatRelativeTime(props.content.createdAt ?? new Date().getTime())
);

let timer: ReturnType<typeof setInterval> | null = null;

function setupTimeUpdateInterval() {
  if (timer !== null) {
    clearInterval(timer);
  }

  const updateInterval = getUpdateInterval(props.content.createdAt);

  timer = setInterval(() => {
    relativeTime.value = formatRelativeTime(props.content.createdAt);
    setupTimeUpdateInterval();
  }, updateInterval);
}

onMounted(async () => {
  setupTimeUpdateInterval();

  await nextTick();
  if (!props.content.frontmatter.cover) {
    isLoaded.value = true;
    emit("loaded");
  } else {
    setTimeout(() => {
      if (!isLoaded.value) {
        emit("suspense");
      }
    }, 1000);
  }
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
    class="elysium-ui__card__container w-full grid relative"
    :class="{
      'no-cover': !props.content.frontmatter.cover,
      'opacity-0': !isVisible,
      'opacity-100': isVisible,
    }"
    :style="{
      maxWidth: `${props.maxWidth}px`,
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
    <div class="elysium-ui__card--content flex flex-col pb-5">
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
      <h2 class="elysium-ui__card--title pt-4 pl-4 pr-4 m-0">
        <a :href="withBase(props.content.url)">
          {{ formalizeString(props.content.frontmatter.title) }}
        </a>
      </h2>
      <ElySpace
        :size="0"
        divider="・"
        wrap
        class="pt-1.5 pl-4 pr-4 text-tertiary text-xs"
      >
        <span>{{ relativeTime }}</span>
        <span>{{ props.content.wordsCount }} 字</span>
        <span v-if="props.content.imgCount > 0"
          >{{ props.content.imgCount }} 张图片</span
        >
        <span>{{ props.content.readingTime }} 分钟读完</span>
      </ElySpace>
      <p
        v-if="props.content.frontmatter.description"
        class="elysium-ui__card--description pt-3 pl-4 pr-4 m-0 text-sm"
      >
        {{ props.content.frontmatter.description }}
      </p>
      <div
        v-if="props.content.frontmatter.tags?.length"
        class="elysium-ui__card--tags flex flex-wrap gap-1.5 pt-4 pl-4 pr-4"
      >
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
.elysium-ui__card {
  &__container {
    grid-template-areas:
      "cover"
      "content";
    background-color: var(--gouache-chalk);
    border: 1px solid var(--color-accent-border-200);
    border-radius: 2px;
    isolation: isolate;
    transition:
      opacity 0.45s ease,
      transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
      border-color 0.3s ease;

    &.no-cover {
      grid-template-areas: "content";
    }

    // Flat gouache backing plane revealed on hover (figure-ground counterchange, zero blur)
    &::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      border-radius: 2px;
      background-color: var(--gouache-wash);
      border: 1px solid transparent;
      transform: translate3d(0, 0, 0);
      opacity: 0;
      pointer-events: none;
      transition:
        transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.3s ease,
        border-color 0.3s ease;
    }

    // Subtle open upper-left drafting tick on hover
    &::after {
      content: "";
      position: absolute;
      top: -5px;
      left: -5px;
      width: 12px;
      height: 12px;
      border-top: 1px solid var(--gouache-pigment);
      border-left: 1px solid var(--gouache-pigment);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease;
    }

    &:hover {
      transform: translate3d(-2px, -2px, 0);
      border-color: var(--color-accent-border-500);

      &::before {
        transform: translate3d(5px, 5px, 0);
        opacity: 1;
        border-color: var(--color-accent-border-200);
      }

      &::after {
        opacity: 1;
      }
    }
  }

  &--cover-container {
    grid-area: cover;
    background-color: var(--gouache-wash);
    border-bottom: 1px solid var(--color-accent-border-100);
    border-radius: 1px 1px 0 0;
  }

  &--cover {
    opacity: 0;

    &.loaded {
      opacity: 1;
    }
  }

  &--content {
    grid-area: content;
    background-color: var(--gouache-chalk);
    border-radius: 1px;
  }

  // Unified editorial serif title matching the frontispiece
  &--title {
    font-family: var(--font-family-serif);
    font-weight: 600;
    font-size: 1.15rem;
    line-height: 1.45;
    letter-spacing: 0.015em;
    color: var(--gouache-ink);

    a {
      color: inherit;
      text-decoration: none;
    }
  }

  &--description {
    font-family: var(--font-family-base);
    line-height: 1.65;
    color: var(--color-accent-text-secondary);
  }
}

@media (prefers-reduced-motion: reduce) {
  .elysium-ui__card__container {
    transition: none !important;

    &:hover {
      transform: none;
    }
  }
}
</style>
