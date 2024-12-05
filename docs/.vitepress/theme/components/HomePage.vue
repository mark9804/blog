<script setup lang="ts">
import {
  nextTick,
  computed,
  ref,
  watch,
  useTemplateRef,
  onMounted,
  onActivated,
} from "vue";
import { useDark, useCssVar, useElementSize } from "@vueuse/core";
import { useData } from "vitepress";
import { postData, defaultFilter } from "../utils/usePostData";
import VPLocalSearchBox from "vitepress/dist/client/theme-default/components/VPNavBarSearch.vue";
const { theme } = useData();
const props = computed(() => {
  if (theme.value.userProfile) {
    const { name, avatar, bio, email, social } = theme.value.userProfile || {};
    return { name, avatar, bio, email, social };
  }
  return null;
});

const posts = ref([]);
const articleTitleRef = useTemplateRef<HTMLHeadingElement>("articleTitleRef");
const { isDark: themeIsDark } = useData();
const isDark = computed(() => useDark().value || themeIsDark.value);
const accentColor = ref(useCssVar("--color-accent").value);
const backgroundColor = ref(useCssVar("--color-accent-quaternary").value);

const { width: articleTitleWidth } = useElementSize(articleTitleRef);

postData.getAllPosts(defaultFilter).then(res => {
  posts.value = res;
});

watch(
  () => isDark.value,
  newVal => {
    nextTick(() => {
      accentColor.value = useCssVar("--color-accent").value;
      backgroundColor.value = newVal
        ? useCssVar("--color-accent-base").value
        : useCssVar("--color-accent-quaternary").value;
      setThemeOnActivated();
    });
  }
);

function setThemeOnActivated() {
  nextTick(() => {
    const htmlElement = document.documentElement;
    if (isDark.value) {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
  });
}

onActivated(() => setThemeOnActivated());
onMounted(() => setThemeOnActivated());
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
    <main
      class="w-full max-w-[1272px] flex flex-col pl-16 xs:pl-10 xs:pr-10 pr-16 mt-10 mb-20"
    >
      <h1 class="mb-10 flex flex-nowrap items-end gap-5" ref="articleTitleRef">
        <span class="home-title">Breves</span>
        <VPLocalSearchBox />
      </h1>
      <ArticleWaterfallList :posts="posts" :width="articleTitleWidth" />
    </main>
  </div>
</template>

<style scoped lang="scss">
@media (max-width: 475px) {
  .home-page {
    flex-direction: column;
  }
}

:deep(.VPNavBarSearch) {
  padding: 0;
}

:deep(.DocSearch-Button) {
  height: 36px;
}
</style>
