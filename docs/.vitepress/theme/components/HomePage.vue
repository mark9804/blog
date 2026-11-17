<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue";
import { useElementSize } from "@vueuse/core";
import { useData } from "vitepress";
import {
  postData,
  defaultFilter,
  defaultQuaversFilter,
} from "../utils/usePostData";
import VPNavBarSearch from "vitepress/dist/client/theme-default/components/VPNavBarSearch.vue";

const { theme } = useData();
const profileProps = computed(() => {
  if (theme.value.userProfile) {
    const { name, avatar, bio, email, social } = theme.value.userProfile || {};
    return { name, avatar, bio, email, social };
  }
  return null;
});

const posts = postData.getAllPosts(defaultFilter);
const quavers = postData.getAllPosts(defaultQuaversFilter);

const postType = ref<"breves" | "quavers">("breves");
const waterfallData = computed(() =>
  postType.value === "breves" ? posts : quavers
);

const articleHeaderRef = useTemplateRef<HTMLElement>("articleHeaderRef");
const { width: articleTitleWidth } = useElementSize(articleHeaderRef);

function toggleWaterfall(type: "breves" | "quavers") {
  postType.value = type;
}
</script>

<template>
  <div class="home-page w-full overflow-x-clip flex flex-col items-center">
    <ElyProfile
      v-if="profileProps"
      :name="profileProps.name"
      :avatar="profileProps.avatar"
      :bio="profileProps.bio"
      :email="profileProps.email"
      :social="profileProps.social"
    />
    <main
      class="w-full max-w-[1272px] flex flex-col pl-16 pr-16 max-sm:pl-6 max-sm:pr-6 mt-14 mb-24"
    >
      <div
        ref="articleHeaderRef"
        class="home-index-header relative mb-12 pb-3 flex flex-wrap items-end justify-between gap-4"
      >
        <div
          class="flex items-baseline gap-7"
          role="tablist"
          aria-label="文章分类切换"
        >
          <button
            type="button"
            role="tab"
            :aria-selected="postType === 'breves'"
            class="home-section-tab"
            :class="{ active: postType === 'breves' }"
            @click="toggleWaterfall('breves')"
          >
            <span>Breves</span>
            <span class="home-section-tab__count">{{ posts.length }}</span>
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="postType === 'quavers'"
            class="home-section-tab"
            :class="{ active: postType === 'quavers' }"
            @click="toggleWaterfall('quavers')"
          >
            <span>Quavers</span>
            <span class="home-section-tab__count">{{ quavers.length }}</span>
          </button>
        </div>
        <VPNavBarSearch />
      </div>
      <ArticleWaterfallList :posts="waterfallData" :width="articleTitleWidth" />
    </main>
  </div>
</template>

<style scoped lang="scss">
// Architectural baseline with subtle left overhang tick
.home-index-header {
  border-bottom: 1px solid var(--color-accent-border-200);

  &::before {
    content: "";
    position: absolute;
    left: -14px;
    bottom: -1px;
    width: 14px;
    height: 1px;
    background-color: var(--color-accent-border-400);
  }

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -9px;
    width: 1px;
    height: 16px;
    background-color: var(--color-accent-border-300);
  }
}

.home-section-tab {
  position: relative;
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  padding: 2px 4px 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: var(--font-family-serif);
  font-weight: 500;
  font-size: 1.75rem;
  line-height: 1.2;
  letter-spacing: 0.03em;
  color: var(--color-accent-text-tertiary);
  transition: color 0.25s ease;

  &__count {
    font-family: var(--font-family-base);
    font-size: 0.75rem;
    font-weight: 450;
    letter-spacing: 0.04em;
    color: var(--color-accent-text-tertiary);
    transform: translateY(-2px);
  }

  // Negative-space paper cut + crisp ink bar along the baseline when active
  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -13px;
    width: 100%;
    height: 2px;
    background-color: var(--gouache-ink);
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &:hover {
    color: var(--color-accent-text-secondary);
  }

  &.active {
    color: var(--gouache-ink);

    .home-section-tab__count {
      color: var(--color-accent);
    }

    &::after {
      transform: scaleX(1);
    }
  }
}

:deep(.VPNavBarSearch) {
  padding: 0 !important;
  justify-content: flex-end;
}

:deep(#local-search) {
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
}

:deep(.VPNavBarSearchButton) {
  height: 36px;
  padding: 0 10px;
  border-radius: 0;
  background-color: transparent;
  border: 1px solid var(--color-accent-border-200);
  transition:
    border-color 0.25s ease,
    background-color 0.25s ease;

  @media (min-width: 48rem) {
    display: grid;
    grid-template-columns: min-content 1fr min-content;
    gap: 10px;
    justify-items: start;
    align-items: center;
    width: 320px;
    max-width: 100%;
    padding: 0 12px;
  }

  &:hover {
    border-color: var(--color-accent-border-500);
    background-color: var(--gouache-wash);
  }

  // Negative-space paper cutouts inside the search bar (strip VitePress .keys wrapper border)
  .keys {
    border: none;
    border-radius: 0;
    padding: 0;
    background: transparent;

    kbd {
      font-family: var(--font-family-base);
      background-color: var(--gouache-paper);
      border: none;
      box-shadow: none;
      border-radius: 0;
      padding: 2px 5px;
    }
  }
}
</style>
