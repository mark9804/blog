<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  useTemplateRef,
  watch,
} from "vue";
import type { GiscusProps } from "./types/GiscusProps";

const GISCUS_SESSION_KEY = "giscus-session";
const DEFAULT_HOST = "https://giscus.app";

const props = withDefaults(defineProps<GiscusProps>(), {
  host: DEFAULT_HOST,
  strict: "0",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "bottom",
  theme: "preferred_color_scheme",
  lang: "zh-CN",
  loading: "lazy",
});

const emit = defineEmits<{
  (e: "loaded"): void;
  (e: "error", message: string): void;
}>();

const iframeRef = useTemplateRef<HTMLIFrameElement>("iframeRef");
const isClientMounted = ref(false);
const hasIframeLoaded = ref(false);
const iframeHeight = ref(160);
const session = ref("");
const reloadNonce = ref(0);

const resolvedHost = computed(() => {
  try {
    new URL(props.host);
    return props.host;
  } catch {
    return DEFAULT_HOST;
  }
});

function getMetaContent(name: string, useOg = false): string {
  const ogSelector = useOg ? `meta[property='og:${name}'],` : "";
  const el = document.querySelector<HTMLMetaElement>(
    `${ogSelector}meta[name='${name}']`
  );
  return el?.content ?? "";
}

function getCleanedUrl(): URL {
  const url = new URL(window.location.href);
  url.searchParams.delete("giscus");
  url.hash = "";
  return url;
}

function resolveTerm(): string {
  switch (props.mapping) {
    case "url":
      return getCleanedUrl().toString();
    case "title":
      return document.title;
    case "og:title":
      return getMetaContent("title", true);
    case "specific":
      return props.term ?? "";
    case "number":
      return "";
    case "pathname":
    default:
      return window.location.pathname.length < 2
        ? "index"
        : window.location.pathname.substring(1).replace(/\.\w+$/, "");
  }
}

function resolveNumber(): string {
  return props.mapping === "number" ? (props.term ?? "") : "";
}

function setupSession() {
  const url = new URL(window.location.href);
  const urlSession = url.searchParams.get("giscus") ?? "";

  if (urlSession) {
    localStorage.setItem(GISCUS_SESSION_KEY, JSON.stringify(urlSession));
    session.value = urlSession;
    url.searchParams.delete("giscus");
    url.hash = "";
    window.history.replaceState(undefined, document.title, url.toString());
    return;
  }

  const saved = localStorage.getItem(GISCUS_SESSION_KEY);
  if (!saved) return;

  try {
    session.value = JSON.parse(saved) || "";
  } catch {
    localStorage.removeItem(GISCUS_SESSION_KEY);
    session.value = "";
  }
}

function clearSession() {
  localStorage.removeItem(GISCUS_SESSION_KEY);
  session.value = "";
}

// Compute initial iframe src once per mount/reload; subsequent updates go via postMessage
const initialIframeSrc = ref("");

function buildIframeSrc(): string {
  const cleanedUrl = getCleanedUrl().toString();
  const origin = `${cleanedUrl}${props.id ? "#" + props.id : ""}`;
  const description = getMetaContent("description", true);
  const backLink = getMetaContent("giscus:backlink") || cleanedUrl;

  const params = new URLSearchParams({
    origin,
    session: session.value,
    repo: props.repo,
    repoId: props.repoId ?? "",
    category: props.category ?? "",
    categoryId: props.categoryId ?? "",
    term: resolveTerm(),
    number: resolveNumber(),
    strict: props.strict,
    reactionsEnabled: props.reactionsEnabled,
    emitMetadata: props.emitMetadata,
    inputPosition: props.inputPosition,
    theme: props.theme,
    description,
    backLink,
  });

  const localePath = props.lang ? `/${props.lang}` : "";
  return `${resolvedHost.value}${localePath}/widget?${params.toString()}`;
}

function sendSetConfig() {
  const win = iframeRef.value?.contentWindow;
  if (!win || !hasIframeLoaded.value) return;

  win.postMessage(
    {
      giscus: {
        setConfig: {
          repo: props.repo,
          repoId: props.repoId,
          category: props.category,
          categoryId: props.categoryId,
          term: resolveTerm(),
          number: Number(resolveNumber()),
          strict: props.strict === "1",
          reactionsEnabled: props.reactionsEnabled === "1",
          emitMetadata: props.emitMetadata === "1",
          inputPosition: props.inputPosition,
          theme: props.theme,
          lang: props.lang,
        },
      },
    },
    resolvedHost.value
  );
}

function handleIframeLoad() {
  hasIframeLoaded.value = true;
  sendSetConfig();
}

function handleMessage(event: MessageEvent) {
  if (event.origin !== resolvedHost.value) return;
  const payload = event.data;
  if (typeof payload !== "object" || !payload?.giscus) return;

  const giscusData = payload.giscus;
  emit("loaded");

  if (
    typeof giscusData.resizeHeight === "number" &&
    giscusData.resizeHeight > 0
  ) {
    iframeHeight.value = giscusData.resizeHeight;
    hasIframeLoaded.value = true;
  }

  if (giscusData.signOut) {
    clearSession();
    return;
  }

  if (typeof giscusData.error === "string") {
    const err: string = giscusData.error;
    if (
      err.includes("Bad credentials") ||
      err.includes("Invalid state value") ||
      err.includes("State has expired")
    ) {
      if (localStorage.getItem(GISCUS_SESSION_KEY) !== null) {
        clearSession();
        reload();
        return;
      }
    }
    if (!err.includes("Discussion not found")) {
      emit("error", err);
    }
  }
}

function reload() {
  clearSession();
  hasIframeLoaded.value = false;
  iframeHeight.value = 160;
  initialIframeSrc.value = buildIframeSrc();
  reloadNonce.value += 1;
}

defineExpose({ reload });

// Sync theme and config dynamically without tearing down the iframe
watch(
  () => [
    props.theme,
    props.term,
    props.lang,
    props.inputPosition,
    props.reactionsEnabled,
    props.strict,
  ],
  () => {
    sendSetConfig();
  }
);

// When route changes in SPA mode, wait for VitePress to update document.title then sync
watch(
  () => props.routeKey,
  async () => {
    await nextTick();
    requestAnimationFrame(() => {
      if (hasIframeLoaded.value) {
        sendSetConfig();
      } else {
        initialIframeSrc.value = buildIframeSrc();
      }
    });
  }
);

onMounted(() => {
  setupSession();
  initialIframeSrc.value = buildIframeSrc();
  isClientMounted.value = true;
  window.addEventListener("message", handleMessage);
});

onUnmounted(() => {
  window.removeEventListener("message", handleMessage);
});
</script>

<template>
  <div class="ely-giscus w-full">
    <iframe
      v-if="isClientMounted && initialIframeSrc"
      :key="reloadNonce"
      ref="iframeRef"
      title="Comments"
      scrolling="no"
      class="ely-giscus__iframe giscus-frame w-full block border-none"
      :class="{ 'is-loading': !hasIframeLoaded }"
      :style="{ height: `${iframeHeight}px` }"
      :src="initialIframeSrc"
      :loading="props.loading"
      allow="clipboard-write"
      @load="handleIframeLoad"
    />
  </div>
</template>

<style scoped lang="scss">
.ely-giscus__iframe {
  min-height: 150px;
  background-color: transparent;
  color-scheme: light dark;
  transition: opacity 0.28s ease;

  &.is-loading {
    opacity: 0;
  }
}
</style>
