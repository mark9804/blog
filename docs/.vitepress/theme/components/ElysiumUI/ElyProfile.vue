<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, watch } from "vue";
import type { ProfileProps } from "./types/ProfileProps";
import {
  useWindowSize,
  useElementSize,
  usePreferredReducedMotion,
} from "@vueuse/core";
import { createWaveAnimation } from "./_utils/wave";

const props = defineProps<ProfileProps>();

const preferredMotion = usePreferredReducedMotion();

const backgroundCanvas = ref<HTMLCanvasElement>();
const { height: windowHeight } = useWindowSize();
const { height: canvasHeight } = useElementSize(backgroundCanvas);

const avatarMarginTop = computed(() => canvasHeight.value * 0.3 - 56);

let waveController: ReturnType<typeof createWaveAnimation> | null = null;

const createWaveConfig = () => ({
  strokeStyle: props.accent,
  backgroundColor: props.background,
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

onMounted(() => {
  initWaveController();

  window.addEventListener("resize", () => {
    waveController?.resize(windowHeight.value);
  });
});

watch(
  () => [props.accent, props.background],
  () => {
    initWaveController();
  }
);

onUnmounted(() => {
  waveController?.stop();
});

function handleScrollIndicatorClick() {
  window.scrollTo({
    top: windowHeight.value,
    behavior: "smooth",
  });
}
</script>

<template>
  <div
    aria-label="User profile"
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
          :alt="props.name"
        />
      </div>
      <div class="flex flex-col items-center gap-1">
        <h1 class="ely-profile__name text-2xl font-bold m-0 text-primary">
          {{ props.name }}
        </h1>
        <p class="ely-profile__bio text-primary">
          {{ props.bio }}
        </p>
      </div>
      <ElyButton wide as="link" :href="`mailto:${props.email}`"
        ><span class="flex items-center gap-2">
          <icon-email :stroke-width="6" />Contact
        </span></ElyButton
      >
      <ElySpace
        v-if="
          props.social && Array.isArray(props.social) && props.social.length > 0
        "
        :size="0"
        class="text-sm text-primary"
      >
        <a
          v-for="social in props.social"
          class="hover:text-[var(--color-accent)] transition-colors duration-300"
          :key="social.alias"
          :href="social.link"
          target="_blank"
          >{{ social.alias }}</a
        >
        <template #divider>・</template>
      </ElySpace>
    </div>
    <div
      class="ely-profile__scroll-indicator absolute bottom-4 flex flex-col items-center gap-1 text-[var(--color-accent)] cursor-pointer"
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
  </div>
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
