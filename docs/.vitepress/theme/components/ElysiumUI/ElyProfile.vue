<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref } from "vue";
import { useData, withBase } from "vitepress";
import type { ProfileProps } from "./types/ProfileProps";
import {
  usePreferredLanguages,
  usePreferredReducedMotion,
  useWindowSize,
} from "@vueuse/core";
import { isExternalUrl } from "../../utils/urlUtils";
import { Mail, Moon, Quote, Sun } from "@lucide/vue";

const props = defineProps<ProfileProps>();

const { isDark } = useData();
const preferredMotion = usePreferredReducedMotion();
const preferredLanguages = usePreferredLanguages();
const { height: windowHeight } = useWindowSize();

const toggleAppearance = inject("toggle-appearance", () => {
  isDark.value = !isDark.value;
});

const activeLocale = ref("en-US");

const displayName = computed(() => {
  if (activeLocale.value.toLowerCase().startsWith("zh")) {
    return props.name["zh-CN"] || props.name["en-US"];
  }
  return (
    props.name[activeLocale.value] || props.name["en-US"] || props.name["zh-CN"]
  );
});

const isMounted = ref(false);
const parallaxX = ref(0);
const parallaxY = ref(0);
let rafId: number | null = null;

function handlePointerMove(e: PointerEvent) {
  if (preferredMotion.value === "reduce" || e.pointerType !== "mouse") return;
  if (rafId !== null) return;

  const clientX = e.clientX;
  const clientY = e.clientY;

  rafId = requestAnimationFrame(() => {
    const w = window.innerWidth || 1;
    const h = window.innerHeight || 1;
    parallaxX.value = (clientX / w - 0.5) * 2;
    parallaxY.value = (clientY / h - 0.5) * 2;
    rafId = null;
  });
}

function handlePointerLeave() {
  parallaxX.value = 0;
  parallaxY.value = 0;
}

onMounted(() => {
  if (preferredLanguages.value[0]) {
    activeLocale.value = preferredLanguages.value[0];
  }
  requestAnimationFrame(() => {
    isMounted.value = true;
  });
});

onUnmounted(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
  }
});

function handleScrollIndicatorClick() {
  window.scrollTo({
    top: windowHeight.value,
    behavior: preferredMotion.value === "reduce" ? "auto" : "smooth",
  });
}
</script>

<template>
  <header
    aria-label="用户信息"
    class="ely-frontispiece relative w-full h-[100dvh] min-h-[600px] flex items-center justify-center overflow-hidden select-none px-6"
    :class="{ 'is-ready': isMounted }"
    :style="{
      '--px': parallaxX.toFixed(3),
      '--py': parallaxY.toFixed(3),
    }"
    @pointermove="handlePointerMove"
    @pointerleave="handlePointerLeave"
  >
    <!-- Minimalist architectural appearance toggle -->
    <button
      type="button"
      class="ely-frontispiece__theme-toggle absolute top-7 right-8 xs:top-5 xs:right-5 z-20 flex items-center justify-center w-9 h-9 cursor-pointer"
      :aria-label="isDark ? '切换至亮色纸本模式' : '切换至暗色夜读模式'"
      :title="isDark ? '切换至亮色模式' : '切换至暗色模式'"
      @click="toggleAppearance"
    >
      <Sun v-if="isDark" :size="16" :stroke-width="1.5" />
      <Moon v-else :size="16" :stroke-width="1.5" />
    </button>

    <!-- Central Figure-Ground Frontispiece Stage -->
    <div class="ely-frontispiece__stage relative w-full max-w-[660px]">
      <!-- Layer 1: Interlocking Matte Gouache Planes & Negative-Space Cutout -->
      <div
        aria-hidden="true"
        class="ely-frontispiece__planes pointer-events-none absolute inset-0"
      >
        <div class="gouache-plane gouache-plane--wash">
          <div class="gouache-plane__cutout" />
        </div>
        <div class="gouache-plane gouache-plane--pigment" />
      </div>

      <!-- Layer 2: Broken Overhanging Architectural Hairlines -->
      <div
        aria-hidden="true"
        class="ely-frontispiece__lines pointer-events-none absolute inset-0"
      >
        <span class="drafting-line drafting-line--top" />
        <span class="drafting-line drafting-line--left" />
        <span class="drafting-line drafting-line--bottom" />
        <span class="drafting-line drafting-line--right" />
      </div>

      <!-- Layer 3: Editorial Frontispiece Content straddling Figure-Ground Seam -->
      <div
        class="ely-frontispiece__content relative z-10 flex flex-col items-start px-9 py-11 sm:px-14 sm:py-14 gap-7"
      >
        <div
          class="flex flex-col items-start sm:flex-row sm:items-end gap-6 w-full"
        >
          <div class="ely-frontispiece__avatar-frame shrink-0">
            <img
              class="ely-frontispiece__avatar-img w-[88px] h-[88px] block object-cover"
              :src="props.avatar"
              :alt="displayName"
            />
          </div>

          <div class="flex flex-col gap-2 min-w-0 max-w-full">
            <h1 class="ely-frontispiece__name m-0">
              {{ displayName }}
            </h1>
            <p
              v-if="props.bio"
              class="ely-frontispiece__bio m-0 inline-flex self-start items-center gap-2"
            >
              <Quote
                aria-hidden="true"
                :size="12"
                :stroke-width="1.5"
                class="ely-frontispiece__bio-quote ely-frontispiece__bio-quote--open"
              />
              <span>{{ props.bio }}</span>
              <Quote
                aria-hidden="true"
                :size="12"
                :stroke-width="1.5"
                class="ely-frontispiece__bio-quote ely-frontispiece__bio-quote--close"
              />
            </p>
          </div>
        </div>

        <div
          class="ely-frontispiece__footer w-full pt-5 flex flex-wrap items-center justify-between gap-4"
        >
          <a
            v-if="props.email"
            :href="`mailto:${props.email}`"
            aria-label="发送邮件"
            class="ely-frontispiece__contact inline-flex items-center gap-2"
          >
            <Mail :stroke-width="1.5" :size="14" />
            <span>Contact</span>
          </a>

          <nav
            v-if="Array.isArray(props.social) && props.social.length > 0"
            aria-label="站点导航与社交链接"
            class="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm"
          >
            <template v-for="(social, idx) in props.social" :key="social.alias">
              <span
                v-if="idx > 0"
                aria-hidden="true"
                class="text-[var(--gouache-pigment)] select-none"
                >/</span
              >
              <a
                class="ely-frontispiece__nav-link"
                :href="
                  isExternalUrl(social.link)
                    ? social.link
                    : withBase(social.link)
                "
                :target="social.openInNewTab ? '_blank' : undefined"
                :rel="social.openInNewTab ? 'noopener noreferrer' : undefined"
                >{{ social.alias }}</a
              >
            </template>
          </nav>
        </div>
      </div>
    </div>

    <!-- Bottom Ink Scroll Stem -->
    <button
      type="button"
      class="ely-frontispiece__scroll absolute bottom-6 flex flex-col items-center gap-2 cursor-pointer bg-transparent border-none p-2"
      aria-label="向下滚动浏览文章列表"
      @click="handleScrollIndicatorClick"
    >
      <span class="ely-frontispiece__scroll-label">INDEX</span>
      <span class="ely-frontispiece__scroll-track" aria-hidden="true">
        <span class="ely-frontispiece__scroll-nib" />
      </span>
    </button>
  </header>
</template>

<style scoped lang="scss">
.ely-frontispiece {
  --px: 0;
  --py: 0;
  background-color: var(--gouache-paper);

  &__theme-toggle {
    background-color: transparent;
    border: 1px solid var(--color-accent-border-200);
    border-radius: 2px;
    color: var(--color-accent-text-secondary);
    transition:
      color 0.25s ease,
      border-color 0.25s ease,
      background-color 0.25s ease;

    &:hover {
      color: var(--gouache-ink);
      border-color: var(--color-accent-border-500);
      background-color: var(--gouache-wash);
    }
  }

  // Parallax layers
  &__planes {
    transform: translate3d(calc(var(--px) * -6px), calc(var(--py) * -6px), 0);
    transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &__lines {
    transform: translate3d(calc(var(--px) * -9px), calc(var(--py) * -9px), 0);
    transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &__content {
    opacity: 0;
    transform: translate3d(0, 10px, 0);
    transition:
      opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1) 0.14s,
      transform 0.75s cubic-bezier(0.22, 1, 0.36, 1) 0.14s;
  }

  &.is-ready &__content {
    opacity: 1;
    transform: translate3d(calc(var(--px) * 3px), calc(var(--py) * 3px), 0);
  }

  // Avatar with negative-space paper mat cutting into the gouache wash block
  &__avatar-frame {
    width: fit-content;
    padding: 4px;
    background-color: var(--gouache-paper);
    border: 1px solid var(--color-accent-border-300);
    box-shadow: 0 0 0 6px var(--gouache-paper);
    border-radius: 2px;
  }

  &__avatar-img {
    border-radius: 1px;
  }

  &__name {
    font-family: var(--font-family-serif);
    font-weight: 500;
    font-size: clamp(2.15rem, 4.2vw, 3.2rem);
    line-height: 1.15;
    letter-spacing: 0.03em;
    color: var(--gouache-ink);
  }

  &__bio {
    font-family: var(--font-family-serif);
    font-style: italic;
    font-weight: 400;
    font-size: 1.125rem;
    line-height: 1.5;
    letter-spacing: 0.04em;
    color: var(--color-accent-text-secondary);
  }

  &__bio-quote {
    color: var(--gouache-pigment);
    flex-shrink: 0;

    &--open {
      align-self: flex-start;
      transform: translateY(-1px) rotate(180deg);
    }

    &--close {
      align-self: flex-end;
      transform: translateY(3px);
    }
  }

  &__footer {
    border-top: 1px solid var(--color-accent-border-200);
  }

  // Positive-negative inverted ink button with offset gouache backing on hover
  &__contact {
    position: relative;
    padding: 7px 16px;
    background-color: var(--gouache-ink);
    color: var(--gouache-paper);
    font-family: var(--font-family-base);
    font-size: 12.5px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-decoration: none;
    border-radius: 2px;
    transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      border-radius: 2px;
      background-color: var(--gouache-pigment);
      transform: translate3d(0, 0, 0);
      opacity: 0;
      transition:
        transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.25s ease;
    }

    &:hover {
      transform: translate3d(-2px, -2px, 0);

      &::after {
        transform: translate3d(4px, 4px, 0);
        opacity: 0.65;
      }
    }
  }

  &__nav-link {
    position: relative;
    color: var(--color-accent-text-secondary);
    text-decoration: none;
    padding: 2px 0;
    transition: color 0.25s ease;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
      background-color: var(--gouache-ink);
      transform: scaleX(0);
      transform-origin: left center;
      transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
    }

    &:hover {
      color: var(--gouache-ink);

      &::after {
        transform: scaleX(1);
      }
    }
  }

  // Bottom scroll stem
  &__scroll {
    opacity: 0.85;
    transition: opacity 0.25s ease;

    &:hover {
      opacity: 1;
    }
  }

  &__scroll-label {
    font-family: var(--font-family-base);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.26em;
    color: var(--color-accent-text-tertiary);
  }

  &__scroll-track {
    position: relative;
    display: block;
    width: 1px;
    height: 42px;
    background-color: var(--color-accent-border-200);
    overflow: hidden;
  }

  &__scroll-nib {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 14px;
    background-color: var(--gouache-ink);
    animation: ink-glide 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
}

// Matte Gouache Figure-Ground Planes
.gouache-plane {
  position: absolute;
  border-radius: 2px;
  opacity: 0;
  transition:
    opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);

  &--wash {
    top: -14px;
    left: -12px;
    width: 68%;
    height: 74%;
    background-color: var(--gouache-wash);
    transform: translate3d(-8px, -6px, 0);

    .ely-frontispiece.is-ready & {
      opacity: 1;
      animation: plane-drift-a 16s ease-in-out 0.9s infinite alternate;
      transform: translate3d(0, 0, 0);
    }
  }

  // Negative-space paper cutout carving into the wash block
  &__cutout {
    position: absolute;
    right: -1px;
    bottom: -1px;
    width: 34%;
    height: 36%;
    background-color: var(--gouache-paper);
  }

  &--pigment {
    right: -10px;
    bottom: -14px;
    width: 44%;
    height: 46%;
    background-color: color-mix(
      in srgb,
      var(--gouache-pigment) 24%,
      var(--gouache-paper)
    );
    opacity: 0;
    transform: translate3d(8px, 6px, 0);

    .ely-frontispiece.is-ready & {
      opacity: 1;
      animation: plane-drift-b 19s ease-in-out 0.9s infinite alternate;
      transform: translate3d(0, 0, 0);
    }
  }
}

// Overhanging Non-Closed Architectural Hairlines
.drafting-line {
  position: absolute;
  background-color: var(--color-accent-border-400);
  transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);

  &--top {
    top: 0;
    left: -22px;
    width: 78%;
    height: 1px;
    transform-origin: left center;
    transform: scaleX(0);

    .ely-frontispiece.is-ready & {
      transform: scaleX(1);
    }
  }

  &--left {
    top: -22px;
    left: 0;
    width: 1px;
    height: 76%;
    transform-origin: center top;
    transform: scaleY(0);

    .ely-frontispiece.is-ready & {
      transform: scaleY(1);
    }
  }

  &--bottom {
    bottom: 0;
    right: -22px;
    width: 66%;
    height: 1px;
    transform-origin: right center;
    transform: scaleX(0);
    transition-delay: 0.08s;

    .ely-frontispiece.is-ready & {
      transform: scaleX(1);
    }
  }

  &--right {
    bottom: -22px;
    right: 0;
    width: 1px;
    height: 62%;
    transform-origin: center bottom;
    transform: scaleY(0);
    transition-delay: 0.08s;

    .ely-frontispiece.is-ready & {
      transform: scaleY(1);
    }
  }
}

@keyframes plane-drift-a {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(6px, 4px, 0);
  }
}

@keyframes plane-drift-b {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-6px, -5px, 0);
  }
}

@keyframes ink-glide {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  100% {
    transform: translateY(310%);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ely-frontispiece {
    &__planes,
    &__lines,
    &__content {
      transition: none !important;
      transform: none !important;
      opacity: 1 !important;
    }

    &__scroll-nib {
      animation: none !important;
      top: 14px;
    }
  }

  .gouache-plane {
    animation: none !important;
    transition: none !important;
    transform: none !important;
    opacity: 1 !important;
  }

  .drafting-line {
    transition: none !important;
    transform: none !important;
  }
}
</style>
