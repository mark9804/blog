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
import {
  postData,
  defaultFilter,
  defaultQuaversFilter,
} from "../utils/usePostData";
import VPNavBarSearch from "vitepress/dist/client/theme-default/components/VPNavBarSearch.vue";
import type { Post } from "../types/Post";

const { theme } = useData();
const props = computed(() => {
  if (theme.value.userProfile) {
    const { name, avatar, bio, email, social } = theme.value.userProfile || {};
    return { name, avatar, bio, email, social };
  }
  return null;
});

const posts = ref<Post[]>([]);
const quavers = ref<Post[]>([]);
const postType = ref<"breves" | "quavers">("breves");
const waterfallData = computed(() =>
  postType.value === "breves" ? posts.value : quavers.value
);
const articleTitleRef = useTemplateRef<HTMLHeadingElement>("articleTitleRef");
const { isDark: themeIsDark } = useData();
const isDark = computed(() => useDark().value || themeIsDark.value);
const accentColor = ref(useCssVar("--color-accent").value);
const backgroundColor = ref(
  isDark.value
    ? useCssVar("--color-accent-base").value
    : useCssVar("--color-accent-quaternary").value
);

const { width: articleTitleWidth } = useElementSize(articleTitleRef);

function initPosts() {
  return Promise.all([
    postData.getAllPosts(defaultFilter).then(res => {
      posts.value = res as Post[];
    }),
    postData.getAllPosts(defaultQuaversFilter).then(res => {
      quavers.value = res as Post[];
    }),
  ]);
}

watch(
  () => isDark.value,
  newVal => {
    nextTick(() => {
      accentColor.value = useCssVar("--color-accent").value;
      console.log(newVal);
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

function toggleWaterfall(type: "breves" | "quavers") {
  postType.value = type;
}

function init() {
  initPosts().then(() => {
    toggleWaterfall("breves");
    setThemeOnActivated();
  });

  () =>
    import(
      "vitepress/dist/client/theme-default/components/VPLocalSearchBox.vue"
    );
}

onActivated(init);
onMounted(init);
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
      <h1
        class="mb-10 flex flex-nowrap items-end justify-between overflow-x-hidden"
        ref="articleTitleRef"
      >
        <div class="flex">
          <ElyButton
            text
            bold
            class="home-title"
            :class="{ active: postType === 'breves' }"
            @click="toggleWaterfall('breves')"
            >Breves</ElyButton
          >
          <ElyButton
            text
            bold
            class="home-title"
            :class="{ active: postType === 'quavers' }"
            @click="toggleWaterfall('quavers')"
            >Quavers</ElyButton
          >
        </div>
        <VPNavBarSearch />
      </h1>
      <ArticleWaterfallList :posts="waterfallData" :width="articleTitleWidth" />
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
  justify-content: flex-end;
}

:deep(#local-search) {
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
}

:deep(.DocSearch-Button) {
  padding: 0 12px;
  justify-content: space-between;
  flex-grow: 1;
  max-width: 280px;
  border-radius: 3px;
}

.home-title {
  cursor: pointer !important;
  font-size: 1.5rem;
  line-height: 2rem;
  color: var(--color-accent-text-tertiary);

  &:after {
    content: "";
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0;
    background-color: var(--color-accent);
    transition: height 0.3s ease-in-out;
  }

  &.active {
    color: var(--color-accent-text-primary);
    border-radius: 0;

    &:after {
      height: 4px;
    }
  }
}
</style>
