<script setup lang="ts">
declare global {
  interface Document {
    startViewTransition(callback: () => Promise<void> | void): {
      ready: Promise<void>;
    };
  }
}

import { useData } from "vitepress";
import { nextTick, onBeforeMount, provide, ComputedRef } from "vue";
import DefaultTheme from "vitepress/theme";
import type { ArticleInfo } from "../types/ArticleInfo";
import { useSearchTags } from "../utils/tagSearchUtils";
import { useCustomStore } from "../../stores/piniaStore";

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
