<script setup lang="ts">
import { useData, useRouter } from "vitepress";
import DefaultTheme from "vitepress/theme-without-fonts";
import {
  nextTick,
  onMounted,
  onUnmounted,
  provide,
  ref,
  watch,
  type ComputedRef,
} from "vue";
import GiscusComment from "../components/GiscusComment.vue";
import ElyGitChangelog from "../components/ElysiumUI/ElyGitChangelog.vue";
import ElyImagePreview from "../components/ElysiumUI/ElyImagePreview.vue";
import ElySpace from "../components/ElysiumUI/ElySpace.vue";
import ElySpinner from "../components/ElysiumUI/ElySpinner.vue";
import ElyTag from "../components/ElysiumUI/ElyTag.vue";
import ElyToastMessage from "../components/ElysiumUI/ElyToastMessage.vue";
import type { PostFrontmatter } from "../types/Post";
import { useTagNavigation } from "../composables/useTagNavigation";
import { useFormulaCopy } from "../composables/useFormulaCopy";

declare const __INJECT_SPEED_INSIGHTS__: boolean;

useFormulaCopy();
const { navigateToTag } = useTagNavigation();

const { isDark, frontmatter: rawFrontmatter } = useData();
const frontmatter = rawFrontmatter as ComputedRef<PostFrontmatter>;
const { Layout } = DefaultTheme;

const enableTransitions = () =>
  "startViewTransition" in document &&
  window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

provide("toggle-appearance", async () => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value;
    return;
  }

  // Keep CSS transitions disabled until the snapshots have been removed.
  document.documentElement.classList.add("vt-transitioning");

  const transition = document.startViewTransition(async () => {
    isDark.value = !isDark.value;
    await nextTick();
  });

  await transition.ready;

  const animation = document.documentElement.animate(
    { opacity: isDark.value ? [1, 0] : [0, 1] },
    {
      duration: 300,
      easing: "ease-in-out",
      // Keep the faded-out snapshot hidden until the view transition removes it.
      fill: "forwards",
      pseudoElement: `::view-transition-${isDark.value ? "old" : "new"}(root)`,
    }
  );

  await transition.finished;
  // Release the fill effect before the pseudo-element is used again.
  animation.cancel();
  document.documentElement.classList.remove("vt-transitioning");
});

const router = useRouter();
const isLoading = ref(false);
let loadingTimer: ReturnType<typeof setTimeout> | null = null;
let stopSpeedInsightsWatch: (() => void) | null = null;
let isLayoutUnmounted = false;

if (__INJECT_SPEED_INSIGHTS__) {
  onMounted(async () => {
    const { injectSpeedInsights, computeRoute } =
      await import("@vercel/speed-insights");
    if (isLayoutUnmounted) return;
    const tracker = injectSpeedInsights(
      {
        framework: "vitepress",
        basePath: import.meta.env.VITE_VERCEL_OBSERVABILITY_BASEPATH,
      },
      import.meta.env.VITE_VERCEL_OBSERVABILITY_CLIENT_CONFIG
    );
    if (!tracker) return;
    stopSpeedInsightsWatch = watch(
      () => router.route.path,
      path => {
        const params = router.route.data.params as
          Record<string, string | string[]> | undefined;
        tracker.setRoute(computeRoute(path, params ?? null));
      },
      { immediate: true }
    );
  });
}

function clearLoadingTimer() {
  if (loadingTimer !== null) {
    clearTimeout(loadingTimer);
    loadingTimer = null;
  }
}

const prevBeforeRouteChange = router.onBeforeRouteChange;
const prevAfterRouteChange = router.onAfterRouteChange;

// Delay spinner by 200ms so normal fast SPA route transitions never flash
router.onBeforeRouteChange = async to => {
  const shouldContinue = await prevBeforeRouteChange?.(to);
  if (shouldContinue === false) return false;

  clearLoadingTimer();
  if (!import.meta.env.SSR) {
    loadingTimer = setTimeout(() => {
      isLoading.value = true;
    }, 200);
  }
};

router.onAfterRouteChange = async to => {
  clearLoadingTimer();
  isLoading.value = false;
  await prevAfterRouteChange?.(to);
};

onUnmounted(() => {
  isLayoutUnmounted = true;
  stopSpeedInsightsWatch?.();
  stopSpeedInsightsWatch = null;
  clearLoadingTimer();
  router.onBeforeRouteChange = prevBeforeRouteChange;
  router.onAfterRouteChange = prevAfterRouteChange;
});
</script>

<template>
  <ElyToastMessage />
  <transition name="fade-in-out">
    <ElySpinner v-if="isLoading" :size="34" label="LOADING" fullscreen />
  </transition>
  <Layout>
    <template #doc-footer-before>
      <div class="article-colophon">
        <div
          v-if="frontmatter.tags?.length"
          role="list"
          aria-label="文章标签"
          class="article-colophon__tags flex flex-wrap items-center gap-2"
        >
          <ElyTag
            v-for="tag in frontmatter.tags"
            :key="tag"
            role="listitem"
            size="small"
            clickable
            :title="`搜索含有「${tag}」标签的文章`"
            @click="navigateToTag(tag)"
          >
            {{ tag }}
          </ElyTag>
        </div>
        <ElyGitChangelog />
      </div>
    </template>
    <template #layout-bottom>
      <ElyImagePreview />
    </template>

    <template #doc-after>
      <GiscusComment v-if="frontmatter.comment !== false" />
      <ElySpace
        v-else
        wide
        justify="center"
        align="center"
        :size="0"
        class="mt-10 text-sm"
      >
        <span class="text-tertiary select-none">本页面禁止评论</span>
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

@media (prefers-reduced-motion: reduce) {
  .fade-in-out-enter-active,
  .fade-in-out-leave-active {
    transition: none;
  }
}
</style>
