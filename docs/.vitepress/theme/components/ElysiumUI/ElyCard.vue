<script setup lang="ts">
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  nextTick,
  useSlots,
  useTemplateRef,
} from "vue";
import type { CardProps } from "./types/CardProps";
import { withBase } from "vitepress";
import {
  formatDateTime,
  formatRelativeTime,
  getUpdateInterval,
} from "../../utils/timeUtils";
import { useSearchTags } from "../../utils/tagSearchUtils";
import { useCustomStore } from "../../../stores/piniaStore";
import { formalizeString } from "./_utils/stringUtils";

const store = useCustomStore();
const slots = useSlots();

const emit = defineEmits<{
  (e: "loaded"): void;
  (e: "suspense"): void;
}>();

const isLoaded = ref(false);
const isVisible = ref(false);
const imageLoaded = ref(false);
const coverImgRef = useTemplateRef<HTMLImageElement>("coverImgRef");

const handleImageLoad = () => {
  if (imageLoaded.value) return;
  imageLoaded.value = true;
  isLoaded.value = true;
  emit("loaded");
};

const props = withDefaults(defineProps<CardProps>(), {
  maxWidth: 280,
  href: "",
  ariaLabel: "",
  external: false,
  as: "card",
});

const isLink = computed(() => props.as === "link");

const resolvedMaxWidth = computed(() =>
  typeof props.maxWidth === "number" ? `${props.maxWidth}px` : props.maxWidth
);

const resolvedHref = computed(() => {
  if (props.href) return props.href;
  return props.content?.url ? withBase(props.content.url) : "";
});

const resolvedAriaLabel = computed(() => {
  if (props.ariaLabel) return props.ariaLabel;
  return props.content?.frontmatter.title
    ? `Read more about ${props.content.frontmatter.title}`
    : undefined;
});

function handleTagClick(tag: string) {
  store.resetTags();
  store.pushSelectedTags(tag);
  useSearchTags.go();
}

// Deterministic build-time fallback avoids SSR/client hydration clock skew
const relativeTime = ref(
  props.content?.createdAt
    ? formatDateTime(props.content.createdAt).slice(0, 10)
    : ""
);

let timer: ReturnType<typeof setInterval> | null = null;
let suspenseTimer: ReturnType<typeof setTimeout> | null = null;

function setupTimeUpdateInterval() {
  if (timer !== null) {
    clearInterval(timer);
    timer = null;
  }

  const createdAt = props.content?.createdAt;
  if (!createdAt) return;

  relativeTime.value = formatRelativeTime(createdAt);
  const updateInterval = getUpdateInterval(createdAt);

  timer = setInterval(() => {
    relativeTime.value = formatRelativeTime(createdAt);
    setupTimeUpdateInterval();
  }, updateInterval);
}

onMounted(async () => {
  setupTimeUpdateInterval();

  await nextTick();
  if (!props.content?.frontmatter.cover) {
    isLoaded.value = true;
    emit("loaded");
  } else if (coverImgRef.value?.complete) {
    // Cached images on SPA router return already have complete === true before @load fires
    if (coverImgRef.value.naturalWidth > 0) {
      handleImageLoad();
    } else {
      emit("suspense");
    }
  } else {
    suspenseTimer = setTimeout(() => {
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
    timer = null;
  }
  if (suspenseTimer !== null) {
    clearTimeout(suspenseTimer);
    suspenseTimer = null;
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
      maxWidth: resolvedMaxWidth,
    }"
    :href="isLink && resolvedHref ? resolvedHref : undefined"
    :target="isLink && props.external ? '_blank' : undefined"
    :rel="isLink && props.external ? 'noopener noreferrer' : undefined"
  >
    <!-- Layer 0: Same-size matte gouache plane offset by (4px, 4px) -->
    <span aria-hidden="true" class="elysium-ui__card--gouache-plane" />

    <!-- Layer 1: Open 25% diagonal crosshairs that connect at corners on hover -->
    <div
      aria-hidden="true"
      class="elysium-ui__card--crosshairs pointer-events-none absolute inset-0 z-1"
    >
      <span class="card-crosshair card-crosshair--top" />
      <span class="card-crosshair card-crosshair--left" />
      <span class="card-crosshair card-crosshair--bottom" />
      <span class="card-crosshair card-crosshair--right" />
    </div>

    <!-- Middle Layer (z-2): Full-card hyperlink for pointer & screen-reader spatial selection -->
    <a
      v-if="resolvedHref && !isLink"
      :href="resolvedHref"
      :target="props.external ? '_blank' : undefined"
      :rel="props.external ? 'noopener noreferrer' : undefined"
      class="absolute inset-0 w-full h-full z-2"
      tabindex="-1"
      :aria-hidden="shouldAriaLabelHide"
      :aria-label="resolvedAriaLabel"
      @mouseover="shouldAriaLabelHide = false"
      @mouseleave="shouldAriaLabelHide = true"
    />
    <!-- Bottom Presentation Layer (z-auto: no stacking context, so z-3 tags escape above z-2 link) -->
    <div class="elysium-ui__card--content relative flex flex-col py-5 px-5">
      <div
        class="elysium-ui__card--cover-container relative w-full overflow-hidden mb-4"
        v-if="props.content?.frontmatter.cover"
      >
        <img
          ref="coverImgRef"
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
        <slot name="title">
          <a
            v-if="props.content"
            :href="resolvedHref"
            :target="props.external ? '_blank' : undefined"
            :rel="props.external ? 'noopener noreferrer' : undefined"
          >
            {{ formalizeString(props.content.frontmatter.title) }}
          </a>
        </slot>
      </h2>
      <slot name="meta">
        <ElySpace
          v-if="props.content"
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
      </slot>
      <slot>
        <p
          v-if="props.content?.frontmatter.description"
          class="elysium-ui__card--description pt-3.5 m-0 text-sm"
        >
          {{ props.content.frontmatter.description }}
        </p>
      </slot>
      <div
        v-if="slots.footer || props.content?.frontmatter.tags?.length"
        class="elysium-ui__card--tags flex flex-wrap gap-1.5 pt-4"
      >
        <slot name="footer">
          <!-- Top Layer (z-3): Interactive tags sit above the z-2 hyperlink overlay -->
          <ElyTag
            v-for="tag in props.content?.frontmatter.tags"
            :key="tag"
            class="relative z-3"
            :id="tag"
            :title="`搜索含有「${tag}」标签的文章`"
            size="small"
            clickable
            @click="handleTagClick(tag)"
          >
            {{ tag }}
          </ElyTag>
        </slot>
      </div>
    </div>
  </component>
</template>

<style scoped lang="scss">
.elysium-ui__card {
  &__container {
    isolation: isolate;
    background-color: transparent;
    transition: opacity 0.45s ease;

    &:hover {
      .card-crosshair {
        background-color: var(--color-accent-border-600);

        &--top,
        &--bottom {
          width: calc(100% + 9px);
        }

        &--left,
        &--right {
          height: calc(100% + 9px);
        }
      }

      .elysium-ui__card--gouache-plane {
        transform: translate3d(6px, 6px, 0);
        background-color: var(--gouache-wash);
      }

      .elysium-ui__card--title {
        color: var(--color-accent);
      }
    }
  }

  &--crosshairs {
    contain: layout style;
  }

  // Same-size matte gouache backing plane shifted off-register by (x=4px, y=4px)
  &--gouache-plane {
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

  &--cover-container {
    background-color: var(--gouache-paper);
  }

  &--cover {
    opacity: 0;

    &.loaded {
      opacity: 1;
    }
  }

  &--title {
    margin: 0;
    padding: 0;
    border: 0;
    font-family: var(--font-family-serif);
    font-weight: 600;
    font-size: 1.15rem;
    line-height: 1.45;
    letter-spacing: 0.015em;
    color: var(--gouache-ink);
    transition: color 0.25s ease;

    :deep(a) {
      color: inherit;
      text-decoration: none;
    }
  }

  &--description {
    font-family: var(--font-family-base);
    line-height: 1.65;
    color: var(--color-accent-text-secondary);
  }

  // Default tags match the page ground to punch hollow cutouts through the gouache plane
  &--tags
    :deep(.elysium-ui__tag--primary:not(.elysium-ui__tag--clickable:hover)) {
    background-color: var(--gouache-paper);
  }

  // Clickable tags always sit in the top layer (z-3) above the middle z-2 card link
  &--tags :deep(.elysium-ui__tag--clickable) {
    position: relative;
    z-index: 3;
  }
}

.card-crosshair {
  position: absolute;
  background-color: var(--color-accent-border-300);
  transition:
    width 0.34s cubic-bezier(0.22, 1, 0.36, 1),
    height 0.34s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.25s ease;

  &--top {
    top: 0;
    left: -9px;
    width: calc(25% + 9px);
    height: 1px;
  }

  &--left {
    top: -9px;
    left: 0;
    width: 1px;
    height: calc(25% + 9px);
  }

  &--bottom {
    bottom: 0;
    right: -9px;
    width: calc(25% + 9px);
    height: 1px;
  }

  &--right {
    bottom: -9px;
    right: 0;
    width: 1px;
    height: calc(25% + 9px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .elysium-ui__card__container,
  .elysium-ui__card--gouache-plane,
  .card-crosshair {
    transition: none !important;
  }
}
</style>
