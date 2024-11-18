<script setup lang="ts">
import { nextTick, computed, ref, watch } from "vue";
import { useDark, useCssVar } from "@vueuse/core";
import { useData } from "vitepress";

const { theme } = useData();
const props = computed(() => {
  if (theme.value.userProfile) {
    const { name, avatar, bio, email, social } = theme.value.userProfile || {};
    return { name, avatar, bio, email, social };
  }
  return null;
});

import { postData } from "../utils/getPostData";

const posts = ref([]);

const isDark = useDark();
const accentColor = ref(isDark.value ? "#aa7e53" : "#d19062");
const backgroundColor = ref(isDark.value ? "#2f2826" : "#fbfaf8");

postData
  .getAllPosts(el => !el.frontmatter?.meta?.hidden && !el.url.endsWith("/"))
  .then(res => {
    posts.value = res;
  });

watch(isDark, newVal => {
  nextTick(() => {
    accentColor.value = useCssVar("--color-accent").value;
    backgroundColor.value = newVal
      ? useCssVar("--color-accent-base").value
      : useCssVar("--color-accent-quaternary").value;
  });
});
</script>

<template>
  <div class="w-[100dvw] flex flex-col items-center">
    <ElyProfile
      :name="props?.name"
      :avatar="props?.avatar"
      :bio="props?.bio"
      :accent="accentColor"
      :background="backgroundColor"
      :email="props?.email"
      :social="props?.social"
    />
    <section
      class="w-full max-w-[1280px] flex flex-col pl-16 sm:pl-4 md:pl-8 sm:pr-4 md:pr-8 pr-16 mt-10 mb-20"
    >
      <h1 class="home-title mb-10">Articles</h1>
      <ArticleWaterfallList :posts="posts" />
    </section>
  </div>
</template>

<style scoped lang="scss">
@media (max-width: 475px) {
  .home-page {
    flex-direction: column;
  }
}
</style>
