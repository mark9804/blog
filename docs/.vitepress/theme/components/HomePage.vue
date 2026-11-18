<script setup lang="ts">
import { computed, ref } from "vue";
import { useData } from "vitepress";
import { VPNavBarSearch } from "vitepress/theme-without-fonts";
import {
  postData,
  defaultFilter,
  defaultQuaversFilter,
} from "../utils/usePostData";
import ArticleWaterfallList from "./ArticleWaterfallList.vue";
import ElyProfile from "./ElysiumUI/ElyProfile.vue";

const { theme } = useData();
const profileProps = computed(() => theme.value.userProfile ?? null);

const posts = postData.getAllPosts(defaultFilter);
const quavers = postData.getAllPosts(defaultQuaversFilter);

const postType = ref<"breves" | "quavers">("breves");
const waterfallData = computed(() =>
  postType.value === "breves" ? posts : quavers
);

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
        class="home-index-header ely-section-header mb-12 pb-3 flex flex-wrap items-end justify-between gap-4"
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
      <ArticleWaterfallList :posts="waterfallData" />
    </main>
  </div>
</template>

<style scoped lang="scss">
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
  justify-content: flex-end;
}

:deep(#local-search) {
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
}

@media (prefers-reduced-motion: reduce) {
  .home-section-tab,
  .home-section-tab::after {
    transition: none;
  }
}
</style>
