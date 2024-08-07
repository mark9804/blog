<script setup lang="ts">
import { useData } from "vitepress";
import { nextTick, onBeforeMount, provide, ComputedRef } from "vue";
import DefaultTheme from "vitepress/theme";
import DiscussionWidget from "./DiscussionWidget.vue";
import { ArticleInfo } from "../../src/types/ArticleInfo";
import { useRoute, useRouter } from "vitepress";

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

const router = useRouter();

const baseUrl = "/blog/";

function searchTags(tag: string) {
  router.go(`${baseUrl}tags/?keyword=${encodeURIComponent(tag)}`);
}
</script>

<template>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,1,0"
  />
  <Layout>
    <template #doc-footer-before>
      <div class="flex gap-2 pb-4" v-if="frontmatter?.tags?.length">
        <a-tag
          color="arcoblue"
          class="span-tag cursor-pointer"
          v-for="tag in frontmatter?.tags"
          @click="searchTags(tag)"
        >
          <template #icon>
            <icon-tag />
          </template>
          {{ tag }}
        </a-tag>
      </div>
    </template>
    <template #doc-after v-if="'/blog/' !== route.path">
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
