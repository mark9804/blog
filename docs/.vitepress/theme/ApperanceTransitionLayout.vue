<script setup lang="ts">
import { useData, withBase, useRoute } from "vitepress";
import { nextTick, onBeforeMount, provide, ComputedRef } from "vue";
import DefaultTheme from "vitepress/theme";
import DiscussionWidget from "./DiscussionWidget.vue";
import { ArticleInfo } from "../../src/types/ArticleInfo";
import SearchTag from "./SearchTag.vue";

const { isDark } = useData();

const enableTransitions = () =>
  "startViewTransition" in document &&
  window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

provide("toggle-appearance", async () => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value;
    return;
  }

  // @ts-ignore
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
const route = useRoute();
const { Layout } = DefaultTheme;
const frontmatter = data.frontmatter as unknown as ComputedRef<
  ArticleInfo["frontmatter"]
>;
</script>

<template>
  <Layout>
    <template #doc-footer-before>
      <div class="flex gap-2 pb-4" v-if="frontmatter?.tags?.length">
        <span class="text-sm text-gray-600 @dark:text-gray-400"
          >Tag{{ frontmatter?.tags?.length > 1 ? "s" : "" }}:
        </span>
        <SearchTag v-for="tag in frontmatter?.tags" :tag="tag" size="small" />
      </div>
    </template>
    <template #doc-after v-if="withBase('/') !== route.path">
      <DiscussionWidget />
    </template>
  </Layout>
</template>

<style>
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
