<script setup lang="ts">
declare global {
  interface Document {
    startViewTransition(callback: () => Promise<void> | void): {
      ready: Promise<void>;
    };
  }
}

import { useData } from "vitepress";
import {
  nextTick,
  onBeforeMount,
  onMounted,
  provide,
  ComputedRef,
  ref,
  watchEffect,
  computed,
} from "vue";
import DefaultTheme from "vitepress/theme";
import type { ArticleInfo } from "../types/ArticleInfo";
import { useSearchTags } from "../utils/tagSearchUtils";
import { useCustomStore } from "../../stores/piniaStore";
import { useRoute } from "vitepress";
import ElyButton from "../components/ElysiumUI/ElyButton.vue";
import ElySpace from "../components/ElysiumUI/ElySpace.vue";

const store = useCustomStore();

const { isDark } = useData();

const enableTransitions = () =>
  "startViewTransition" in document &&
  window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

provide("toggle-appearance", async () => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value;
    return;
  }

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value;
    await nextTick();
  }).ready;

  document
    .querySelector("body")
    ?.setAttribute("arco-theme", isDark.value ? "dark" : "");

  document.documentElement.animate(
    { opacity: isDark.value ? [1, 0] : [0, 1] },
    {
      duration: 300,
      easing: "ease-in-out",
      pseudoElement: `::view-transition-${isDark.value ? "old" : "new"}(root)`,
    }
  );
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

const route = useRoute();

// resolve comment may not visible due to initial giscus error
const shouldHaveComment = computed(() => frontmatter.value.comment !== false); // 应用允许显式禁止评论，不能缩写成 !frontmatter.value.comment
const hasComment = ref(false);
const timer = ref<number | null>(null);

onMounted(() => {
  watchEffect(onInvalidate => {
    // Make sure effect re-runs on route change
    route.path;

    hasComment.value = false;

    onInvalidate(() => {
      if (timer.value) {
        window.clearInterval(timer.value);
        timer.value = null;
      }
    });

    if (shouldHaveComment.value) {
      timer.value = window.setInterval(() => {
        // check if #giscus is visible && width, height > 0
        const giscus = document.getElementById("giscus");
        if (giscus && giscus.offsetWidth > 0 && giscus.offsetHeight > 0) {
          hasComment.value = true;
          if (timer.value) {
            window.clearInterval(timer.value);
            timer.value = null;
          }
        }
      }, 500);
    }
  });
});

function handleReloadComment() {
  window.localStorage.removeItem("giscus-session");
  window.location.reload();
}
</script>

<template>
  <Layout>
    <template #doc-footer-before>
      <div class="flex flex-wrap gap-2 pb-4" v-if="frontmatter?.tags?.length">
        <span class="text-sm text-gray-600 @dark:text-gray-400"
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
    </template>
    <template #layout-bottom>
      <ElyImagePreview />
    </template>

    <template #doc-after>
      <ElySpace
        class="justify-center mt-10 text-sm"
        wide
        :size="0"
        align="center"
        padding="0"
        v-if="shouldHaveComment"
      >
        <div contents v-if="!hasComment">
          <span class="text-[var(--color-text-3)]">加载不出评论？</span>
          <ElyButton text size="mini" @click="handleReloadComment">
            <span class="text-sm">点我试试</span>
          </ElyButton>
        </div>
      </ElySpace>
      <ElySpace
        class="justify-center mt-10 text-sm"
        wide
        :size="0"
        align="center"
        padding="0"
        v-else
      >
        <span class="text-[var(--color-text-3)]">本页面禁止评论</span>
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
</style>
