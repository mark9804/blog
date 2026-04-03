<script setup lang="ts">
declare global {
  interface Document {
    startViewTransition(callback: () => Promise<void> | void): {
      ready: Promise<void>;
    };
  }
}

import { useData, useRouter } from "vitepress";
import GlobalLoader from "../components/GlobalLoader.vue";
import GiscusComment from "../components/GiscusComment.vue";
import {
  nextTick,
  onBeforeMount,
  provide,
  ComputedRef,
  ref,
  defineAsyncComponent,
} from "vue";
import DefaultTheme from "vitepress/theme";
import type { ArticleInfo } from "../types/ArticleInfo";
import { useSearchTags } from "../utils/tagSearchUtils";
import { useCustomStore } from "../../stores/piniaStore";
import { NolebaseGitChangelog } from "@nolebase/vitepress-plugin-git-changelog/client";
declare const __INJECT_SPEED_INSIGHTS__: boolean;

const SpeedInsights = __INJECT_SPEED_INSIGHTS__
  ? defineAsyncComponent(() =>
      import("@vercel/speed-insights/vue").then(m => ({
        default: m.SpeedInsights,
      }))
    )
  : null;

const store = useCustomStore();

const { isDark } = useData();

const enableTransitions = () =>
  "startViewTransition" in document &&
  window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

provide("toggle-appearance", async () => {
  const syncArcoTheme = () => {
    document
      .querySelector("body")
      ?.setAttribute("arco-theme", isDark.value ? "dark" : "");
  };

  if (!enableTransitions()) {
    isDark.value = !isDark.value;
    syncArcoTheme();
    return;
  }

  // Disable CSS transitions to prevent them from firing
  // when view transition pseudo-elements are removed and the live DOM is revealed.
  // Chrome/Firefox re-trigger `transition: all` from the last painted state,
  // causing a white flash. Safari does not.
  document.documentElement.classList.add("vt-transitioning");

  const transition = document.startViewTransition(async () => {
    isDark.value = !isDark.value;
    // Must be inside the callback so the new snapshot captures arco-theme styles.
    syncArcoTheme();
    await nextTick();
  });

  await transition.ready;

  const animation = document.documentElement.animate(
    { opacity: isDark.value ? [1, 0] : [0, 1] },
    {
      duration: 300,
      easing: "ease-in-out",
      pseudoElement: `::view-transition-${isDark.value ? "old" : "new"}(root)`,
    }
  );

  await animation.finished;
  document.documentElement.classList.remove("vt-transitioning");
});

onBeforeMount(() => {
  document
    .querySelector("body")
    ?.setAttribute("arco-theme", isDark.value ? "dark" : "");
});

const data = useData();
const { Layout } = DefaultTheme;
const frontmatter = data.frontmatter as unknown as ComputedRef<
  ArticleInfo["frontmatter"]
>;

function handleTagClick(tag: string) {
  store.resetTags();
  store.pushSelectedTags(tag);
  useSearchTags.go();
}

const router = useRouter();

const isLoading = ref(false);
let loadingTimer: number | null = null;

// 给过长的路由切换（用户网不好时）添加 loading 效果
// 防止用户认为页面无响应
router.onBeforeRouteChange = () => {
  if (loadingTimer) clearTimeout(loadingTimer);
  loadingTimer = window.setTimeout(() => {
    isLoading.value = true;
  }, 200); // 200ms 后再显示 loading，避免网络正常时闪烁打断心流
};

router.onAfterRouteChange = () => {
  if (loadingTimer) {
    clearTimeout(loadingTimer);
    loadingTimer = null;
  }
  isLoading.value = false;
};
</script>

<template>
  <SpeedInsights v-if="SpeedInsights" />
  <transition name="fade-in-out">
    <GlobalLoader v-if="isLoading" />
  </transition>
  <Layout>
    <template #doc-footer-before>
      <div
        class="flex flex-wrap items-center gap-2 pb-4"
        v-if="frontmatter?.tags?.length"
      >
        <span class="text-sm text-secondary"
          >Tag{{ frontmatter?.tags?.length > 1 ? "s" : "" }}:
        </span>
        <ElyTag
          v-for="tag in frontmatter?.tags"
          size="small"
          :id="tag"
          clickable
          @click="handleTagClick(tag)"
        >
          {{ tag }}
        </ElyTag>
      </div>
      <div class="mb-5">
        <NolebaseGitChangelog />
      </div>
    </template>
    <template #layout-bottom>
      <ElyImagePreview />
    </template>

    <template #doc-after>
      <GiscusComment v-if="frontmatter.comment !== false" />
      <ElySpace
        class="justify-center mt-10 text-sm"
        wide
        :size="0"
        padding="0"
        align="center"
        v-else
      >
        <span class="text-[var(--color-text-3)] !select-none cursor-not-allowed"
          >本页面禁止评论</span
        >
      </ElySpace>
    </template>
  </Layout>
</template>

<style lang="scss">
::view-transition-old(root),
::view-transition-new(root) {
  mix-blend-mode: normal;
  animation: none;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}

.vt-transitioning,
.vt-transitioning * {
  transition: none !important;
}

.fade-in-out-enter-active,
.fade-in-out-leave-active {
  transition: opacity 0.3s ease;
}

.fade-in-out-enter-from,
.fade-in-out-leave-to {
  opacity: 0;
}

h2#页面历史 {
  opacity: 0;
  width: 0;
  height: 0;
}
</style>
