<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from "vue";
import type { ProfileProps } from "./types/ProfileProps";
import {
  useWindowSize,
  useCssVar,
  useElementSize,
  usePreferredReducedMotion,
} from "@vueuse/core";
import { createWaveAnimation } from "./_utils/wave";

const props = defineProps<ProfileProps>();

const accentColorRef = useCssVar("--color-accent");
const backgroundColorRef = useCssVar("--color-accent-quaternary");
const preferredMotion = usePreferredReducedMotion();

const backgroundCanvas = ref<HTMLCanvasElement>();
const { height: windowHeight } = useWindowSize();
const { height: canvasHeight } = useElementSize(backgroundCanvas);

const avatarMarginTop = computed(() => canvasHeight.value * 0.3 - 56);

let waveController: ReturnType<typeof createWaveAnimation> | null = null;

onMounted(() => {
  if (backgroundCanvas.value) {
    waveController = createWaveAnimation(
      backgroundCanvas.value,
      {
        strokeStyle: props.accent ?? accentColorRef.value,
        backgroundColor: props.background ?? backgroundColorRef.value,
        verticalPosition: 0.3,
        amplitudeRatio: 0.03,
        periodMultiplier: 0.008,
        waveCount: 5,
      },
      windowHeight.value,
      preferredMotion.value === "reduce"
    );

    waveController.start();

    window.addEventListener("resize", () => {
      waveController?.resize(windowHeight.value);
    });
  }
});

onUnmounted(() => {
  waveController?.stop();
});
</script>

<template>
  <div
    aria-label="User profile"
    class="ely-profile w-full relative flex flex-col items-center absolute top-0 left-0"
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
        <h1 class="ely-profile__name text-2xl font-bold m-0 text-[#2f2826]">
          {{ props.name }}
        </h1>
        <p class="ely-profile__bio text-[#2f2826e0]">
          {{ props.bio }}
        </p>
      </div>
      <ElyButton wide as="link" :href="`mailto:${props.email}`"
        ><span class="flex items-center gap-2">
          <icon-email />Contact
        </span></ElyButton
      >
      <ElySpace
        v-if="
          props.social && Array.isArray(props.social) && props.social.length > 0
        "
        :size="0"
        class="text-sm text-[#2f2826e0]"
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
  </div>
</template>
