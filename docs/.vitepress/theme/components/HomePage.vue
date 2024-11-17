<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import TableOfContents from "./deprecated/TableOfContents.vue";
import ProfileCard from "./deprecated/ProfileCard.vue";
import { useData } from "vitepress";

const { theme } = useData();
const props = computed(() => {
  if (theme.value.userProfile) {
    const { name, avatar, bio, email, social } = theme.value.userProfile;
    return { name, avatar, bio, email, social };
  }
  return null;
});

import { postData } from "../utils/getPostData";

const posts = ref([]);

postData
  .getAllPosts(el => !el.frontmatter?.meta?.hidden && !el.url.endsWith("/"))
  .then(res => {
    posts.value = res;
  });
</script>

<template>
  <div class="w-[100dvw] flex flex-col items-center">
    <ElyProfile
      :name="props?.name"
      :avatar="props?.avatar"
      :bio="props?.bio"
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
