<script setup lang="ts">
import { useData, useRoute } from "vitepress";
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  useTemplateRef,
  watch,
} from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import { RotateCw } from "@lucide/vue";
import { giscusConfig } from "../../configs/giscusConfig";
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

let fallbackTimer: number | null = null;

function updateThemeDataUri() {
  themeDataUri.value = buildGiscusThemeDataUri(isDark.value);
}

function clearFallbackTimer() {
  if (fallbackTimer !== null) {
    window.clearTimeout(fallbackTimer);
    fallbackTimer = null;
  }
}

function armFallbackTimerIfVisible() {
  if (loaded.value || !isNearViewport.value || fallbackTimer !== null) return;
  fallbackTimer = window.setTimeout(() => {
    if (!loaded.value) {
      showFallbackHint.value = true;
    }
  }, 4000);
}

const { stop: stopObserver } = useIntersectionObserver(
  sectionRef,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      isNearViewport.value = true;
      armFallbackTimerIfVisible();
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

// Flush post so VitePress finishes toggling html.dark before sampling CSS custom properties
watch(
  isDark,
  async () => {
    await nextTick();
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
  stopObserver();
  clearFallbackTimer();
});
</script>

<template>
  <section ref="sectionRef" class="giscus-section" aria-label="文章评论">
    <header
      class="giscus-section__header relative mb-6 pb-2.5 flex items-baseline justify-between gap-4"
    >
      <h2 class="giscus-section__title m-0">Comments</h2>
      <button
        v-if="showFallbackHint"
        type="button"
        class="giscus-section__reload inline-flex items-center gap-1.5 cursor-pointer"
        @click="handleReload"
      >
        <RotateCw :size="12" :stroke-width="1.5" />
        <span>加载不出评论？点击重试</span>
      </button>
    </header>

    <ElyGiscus
      v-if="themeDataUri"
      ref="giscusRef"
      :repo="giscusConfig.repo"
      :repo-id="giscusConfig.repoId"
      :category="giscusConfig.category"
      :category-id="giscusConfig.categoryId"
      :mapping="giscusConfig.mapping"
      :input-position="giscusConfig.inputPosition"
      :lang="giscusConfig.lang"
      :loading="giscusConfig.loading"
      :reactions-enabled="giscusConfig.reactionsEnabled"
      :emit-metadata="giscusConfig.emitMetadata"
      :theme="themeDataUri"
      :route-key="routeKey"
      @loaded="handleLoaded"
    />
  </section>
</template>

<style scoped lang="scss">
.giscus-section {
  margin-top: 48px;

  &__header {
    border-bottom: 1px solid var(--color-accent-border-200);

    &::before {
      content: "";
      position: absolute;
      left: -10px;
      bottom: -1px;
      width: 10px;
      height: 1px;
      background-color: var(--color-accent-border-400);
    }

    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: -7px;
      width: 1px;
      height: 13px;
      background-color: var(--color-accent-border-300);
    }
  }

  &__title {
    font-family: var(--font-family-serif);
    font-weight: 500;
    font-size: 1.4rem;
    line-height: 1.25;
    letter-spacing: 0.025em;
    color: var(--gouache-ink);
  }

  &__reload {
    padding: 3px 9px;
    font-family: var(--font-family-base);
    font-size: 12px;
    color: var(--color-accent-text-secondary);
    background-color: var(--gouache-wash);
    border: 1px solid var(--color-accent-border-200);
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover {
      background-color: var(--color-accent);
      color: var(--gouache-paper);
    }
  }
}
</style>
