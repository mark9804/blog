<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, watch } from "vue";
import { withBase } from "vitepress";
import type { ProfileProps } from "./types/ProfileProps";
import {
  useWindowSize,
  useElementSize,
  usePreferredReducedMotion,
  useIntersectionObserver,
  useDebounceFn,
  usePreferredLanguages,
} from "@vueuse/core";
import { createWaveAnimation } from "./_utils/wave";
import { useRouter } from "vitepress";
import { isExternalUrl } from "../../../utils/urlUtils";

const props = defineProps<ProfileProps>();

const preferredMotion = usePreferredReducedMotion();
const preferredLanguages = usePreferredLanguages();
const backgroundCanvas = ref<HTMLCanvasElement>();
const { height: windowHeight } = useWindowSize();
const { height: canvasHeight } = useElementSize(backgroundCanvas);

const name = computed(
  () =>
    props.name[preferredLanguages.value[0]] ||
    props.name["en-US"] ||
    props.name["zh-CN"]
);

const avatarMarginTop = computed(() => canvasHeight.value * 0.3 - 56);

let waveController: ReturnType<typeof createWaveAnimation> | null = null;

const createWaveConfig = () => ({
  strokeStyle: props.accent ?? "var(--color-accent)",
  backgroundColor: props.background ?? "transparent",
  verticalPosition: 0.3,
  amplitudeRatio: 0.02,
  periodMultiplier: 0.008,
  waveCount: 5,
});

function initWaveController() {
  if (!backgroundCanvas.value) return;

  waveController?.stop();
  waveController = createWaveAnimation(
    backgroundCanvas.value,
    createWaveConfig(),
    windowHeight.value,
    preferredMotion.value === "reduce"
  );
  waveController.start();
}

const isVisible = ref(false);

const { stop } = useIntersectionObserver(
  backgroundCanvas,
  ([{ isIntersecting }]) => {
    isVisible.value = isIntersecting;

    if (isIntersecting) {
      initWaveController();
    } else {
      waveController?.stop();
    }
  },
  {
    threshold: 0,
    rootMargin: "50px",
  }
);

const debouncedResize = useDebounceFn((height: number) => {
  if (isVisible.value) {
    waveController?.resize(height);
  }
}, 300);

onMounted(() => {
  window.addEventListener("resize", () => {
    debouncedResize(windowHeight.value);
  });
});

watch(
  () => [props.accent, props.background],
  () => {
    if (isVisible.value) {
      initWaveController();
    }
  }
);

onUnmounted(() => {
  stop();
  waveController?.stop();
});

function handleScrollIndicatorClick() {
  window.scrollTo({
    top: windowHeight.value,
    behavior: "smooth",
  });
}

const router = useRouter();

function handleSocialLinkClick(social: {
  link: string;
  openInNewTab?: boolean;
}) {
  if (social.openInNewTab) {
    window.open(withBase(social.link), "_blank");
  } else {
    // 检查是不是外部链接
    if (isExternalUrl(social.link)) {
      window.open(social.link, "_self");
    } else {
      // 直接调用 withBase 有点问题，需要自己拼接一下 currentPath + link
      const currentPath = router.route.path;
      const newPath = currentPath + social.link.replace(/^\//, "");
      router.go(newPath); // vitepress 没有 router.push，router.go 接受 string
    }
  }
}
</script>

<template>
  <header
    aria-label="用户信息"
    class="ely-profile w-full relative flex flex-col items-center absolute top-0 left-0 select-none"
  >
    <canvas
      aria-hidden="true"
      class="ely-profile__background w-full"
      ref="backgroundCanvas"
    />
    <div
      class="ely-profile__content flex flex-col items-center absolute gap-4"
      :style="{ top: avatarMarginTop + 'px' }"
    >
      <div
        class="ely-profile__avatar-wrapper p-[3px] rounded-full border-solid border-2 border-[var(--color-accent-secondary)]"
      >
        <img
          class="ely-profile__avatar-img w-[100px] h-[100px] rounded-full"
          :src="props.avatar"
          :alt="name"
        />
      </div>
      <div class="flex flex-col items-center gap-1">
        <ClientOnly>
          <h1 class="ely-profile__name text-2xl font-bold m-0 text-primary">
            {{ name }}
          </h1>
        </ClientOnly>
        <p class="ely-profile__bio text-tertiary">
          {{ props.bio }}
        </p>
      </div>
      <ElyButton
        wide
        as="link"
        :href="`mailto:${props.email}`"
        aria-label="发送邮件"
        :style="{ maxWidth: '240px' }"
        bold
        ><span class="flex items-center gap-2">
          <icon-email :stroke-width="6" />Contact
        </span></ElyButton
      >
      <ElySpace
        v-if="
          props.social && Array.isArray(props.social) && props.social.length > 0
        "
        :size="0"
        divider="・"
        class="text-sm text-primary font-normal"
      >
        <a
          v-for="social in props.social"
          class="hover:text-[var(--color-accent)] transition-colors duration-300"
          :key="social.alias"
          :href="withBase(social.link)"
          @click.prevent="handleSocialLinkClick(social)"
          @keydown.enter="handleSocialLinkClick(social)"
          >{{ social.alias }}</a
        >
      </ElySpace>
    </div>
    <div
      class="ely-profile__scroll-indicator absolute bottom-4 flex flex-col items-center gap-1 text-[var(--color-accent)] cursor-pointer"
      aria-hidden="true"
      role="button"
      @click="handleScrollIndicatorClick"
    >
      <icon-double-down
        class="ely-profile__scroll-indicator-icon"
        :stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="bevel"
        :size="36"
        :style="{
          stroke: props.accent,
        }"
      />
      <span class="ely-profile__scroll-indicator-text text-sm">SCROLL</span>
    </div>
  </header>
</template>

<style scoped lang="scss">
.ely-profile__scroll-indicator {
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
