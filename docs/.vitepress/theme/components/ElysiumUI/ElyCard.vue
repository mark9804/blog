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
    class="elysium-ui__card__container w-full flex flex-col relative"
    :class="{
      'opacity-0': !isVisible,
      'opacity-100': isVisible,
    }"
    :style="{
      maxWidth: `${props.maxWidth}px`,
    }"
    :href="isLink && withBase(props.content.url)"
  >
    <!-- Bottom-right offset matte gouache strip sliced by the crosshair -->
    <span aria-hidden="true" class="elysium-ui__card--offset-bar" />

    <!-- Closed drafting perimeter with overhanging crosshairs at top-left & bottom-right -->
    <div
      aria-hidden="true"
      class="elysium-ui__card--crosshairs pointer-events-none absolute inset-0 z-1"
    >
      <span class="card-crosshair card-crosshair--top" />
      <span class="card-crosshair card-crosshair--left" />
      <span class="card-crosshair card-crosshair--bottom" />
      <span class="card-crosshair card-crosshair--right" />
    </div>

    <a
      v-if="props.content.url"
      :href="withBase(props.content.url)"
      class="absolute inset-0 w-full h-full z-2"
      tabindex="-1"
      :aria-hidden="shouldAriaLabelHide"
      :aria-label="`Read more about ${props.content.frontmatter.title}`"
      @mouseover="shouldAriaLabelHide = false"
      @mouseleave="shouldAriaLabelHide = true"
    />
    <div class="elysium-ui__card--content relative z-1 flex flex-col py-5 px-5">
      <div
        class="elysium-ui__card--cover-container z-0 relative w-full overflow-hidden mb-4"
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
      <h2 class="elysium-ui__card--title m-0">
        <a :href="withBase(props.content.url)">
          {{ formalizeString(props.content.frontmatter.title) }}
        </a>
      </h2>
      <ElySpace
        :size="0"
        divider="・"
        wrap
        class="pt-1.5 text-tertiary text-xs"
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
        class="elysium-ui__card--description pt-3.5 m-0 text-sm"
      >
        {{ props.content.frontmatter.description }}
      </p>
      <div
        v-if="props.content.frontmatter.tags?.length"
        class="elysium-ui__card--tags flex flex-wrap gap-1.5 pt-4"
      >
        <ElyTag
          v-for="tag in props.content.frontmatter.tags"
          :key="tag"
          class="z-3"
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
    background-color: transparent;
    transition: opacity 0.45s ease;

    &:hover {
      .card-crosshair {
        background-color: var(--color-accent-border-600);
      }

      .elysium-ui__card--offset-bar {
        transform: scaleX(1);
        background-color: color-mix(
          in srgb,
          var(--gouache-pigment) 30%,
          var(--gouache-wash)
        );
      }

      .elysium-ui__card--title {
        color: var(--color-accent);
      }
    }
  }

  // Subtle off-register gouache strip anchoring the bottom edge of each grid cell
  &--offset-bar {
    position: absolute;
    right: -5px;
    bottom: -5px;
    width: calc(100% - 14px);
    height: 10px;
    background-color: var(--gouache-wash);
    transform-origin: right center;
    transform: scaleX(0.62);
    pointer-events: none;
    z-index: 0;
    transition:
      transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
      background-color 0.25s ease;
  }

  &--cover-container {
    background-color: var(--gouache-wash);
  }

  &--cover {
    opacity: 0;

    &.loaded {
      opacity: 1;
    }
  }

  &--title {
    font-family: var(--font-family-serif);
    font-weight: 600;
    font-size: 1.15rem;
    line-height: 1.45;
    letter-spacing: 0.015em;
    color: var(--gouache-ink);
    transition: color 0.25s ease;

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

.card-crosshair {
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
  .elysium-ui__card__container,
  .elysium-ui__card--offset-bar,
  .card-crosshair {
    transition: none !important;
  }
}
</style>
