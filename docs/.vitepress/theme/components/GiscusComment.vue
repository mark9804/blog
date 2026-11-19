<script setup lang="ts">
import { useData, useRoute } from "vitepress";
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  useTemplateRef,
  watch,
} from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import { RotateCw } from "@lucide/vue";
import { giscusConfig } from "../../configs/giscusConfig";
import ElyButton from "./ElysiumUI/ElyButton.vue";
import ElyGiscus from "./ElysiumUI/ElyGiscus.vue";
import { buildGiscusThemeDataUri } from "./ElysiumUI/_utils/giscusTheme";

const { isDark } = useData();
const route = useRoute();

const sectionRef = useTemplateRef<HTMLElement>("sectionRef");
const giscusRef = useTemplateRef<InstanceType<typeof ElyGiscus>>("giscusRef");
const routeKey = computed(() => route.path);

const loaded = ref(false);
const isNearViewport = ref(false);
const showFallbackHint = ref(false);
const themeDataUri = ref("");

let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

function updateThemeDataUri() {
  themeDataUri.value = buildGiscusThemeDataUri(isDark.value);
}

function clearFallbackTimer() {
  if (fallbackTimer !== null) {
    clearTimeout(fallbackTimer);
    fallbackTimer = null;
  }
}

function armFallbackTimerIfVisible() {
  if (loaded.value || !isNearViewport.value || fallbackTimer !== null) return;
  fallbackTimer = setTimeout(() => {
    if (!loaded.value) {
      showFallbackHint.value = true;
    }
  }, 4000);
}

useIntersectionObserver(
  sectionRef,
  ([entry]) => {
    const intersecting = Boolean(entry?.isIntersecting);
    isNearViewport.value = intersecting;
    if (intersecting) {
      armFallbackTimerIfVisible();
    } else {
      clearFallbackTimer();
    }
  },
  { rootMargin: "300px" }
);

function handleLoaded() {
  loaded.value = true;
  showFallbackHint.value = false;
  clearFallbackTimer();
}

function handleReload() {
  loaded.value = false;
  showFallbackHint.value = false;
  clearFallbackTimer();
  updateThemeDataUri();
  giscusRef.value?.reload();
  armFallbackTimerIfVisible();
}

watch(
  isDark,
  () => {
    updateThemeDataUri();
  },
  { flush: "post" }
);

watch(routeKey, () => {
  loaded.value = false;
  showFallbackHint.value = false;
  clearFallbackTimer();
  armFallbackTimerIfVisible();
});

onMounted(() => {
  updateThemeDataUri();
});

onUnmounted(() => {
  clearFallbackTimer();
});
</script>

<template>
  <section ref="sectionRef" class="giscus-section" aria-label="文章评论">
    <header
      class="giscus-section__header ely-section-header mb-6 pb-2.5 flex flex-wrap items-baseline justify-between gap-4"
    >
      <h2 class="giscus-section__title m-0">Comments</h2>
      <ElyButton
        v-if="showFallbackHint"
        secondary
        size="small"
        @click="handleReload"
      >
        <RotateCw :size="12" :stroke-width="1.5" />
        <span>加载不出评论？点击重试</span>
      </ElyButton>
    </header>

    <ElyGiscus
      v-if="themeDataUri"
      ref="giscusRef"
      v-bind="giscusConfig"
      :theme="themeDataUri"
      :route-key="routeKey"
      @loaded="handleLoaded"
    />
  </section>
</template>

<style scoped lang="scss">
.giscus-section {
  margin-top: 64px;

  &__title {
    font-family: var(--font-family-serif);
    font-weight: 500;
    font-size: 1.4rem;
    line-height: 1.25;
    letter-spacing: 0.025em;
    color: var(--gouache-ink);
  }
}
</style>
