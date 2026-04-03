<script setup lang="ts">
import Giscus from "@giscus/vue";
import { useData, useRoute } from "vitepress";
import { computed, ref, watch, onMounted, onUnmounted } from "vue";
import { giscusConfig } from "../../configs/giscusConfig";

const { isDark } = useData();
const route = useRoute();

// Force re-render on route change by keying on the path
const routeKey = computed(() => route.path);

const theme = computed(() => (isDark.value ? "transparent_dark" : "light"));

// Track whether giscus iframe has loaded
const loaded = ref(false);
let checkTimer: number | null = null;

function startLoadCheck() {
  loaded.value = false;
  if (checkTimer) window.clearInterval(checkTimer);
  checkTimer = window.setInterval(() => {
    const iframe = document.querySelector<HTMLIFrameElement>(
      "iframe.giscus-frame"
    );
    if (iframe && iframe.offsetHeight > 0) {
      loaded.value = true;
      if (checkTimer) {
        window.clearInterval(checkTimer);
        checkTimer = null;
      }
    }
  }, 2000);
}

onMounted(startLoadCheck);
watch(routeKey, startLoadCheck);

onUnmounted(() => {
  if (checkTimer) {
    window.clearInterval(checkTimer);
    checkTimer = null;
  }
});

function handleReload() {
  window.localStorage.removeItem("giscus-session");
  window.location.reload();
}
</script>

<template>
  <div class="giscus-wrapper">
    <Giscus
      :key="routeKey"
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
      :theme="theme"
    />
    <ElySpace
      class="justify-center mt-10 text-sm"
      wide
      :size="0"
      align="center"
      padding="0"
      v-if="!loaded"
    >
      <div contents>
        <span class="text-[var(--color-text-3)]">加载不出评论？</span>
        <ElyButton text size="mini" @click="handleReload">
          <span class="text-sm">点我试试</span>
        </ElyButton>
      </div>
    </ElySpace>
  </div>
</template>

<style scoped>
.giscus-wrapper {
  margin-top: 40px;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 20px;
}
</style>
