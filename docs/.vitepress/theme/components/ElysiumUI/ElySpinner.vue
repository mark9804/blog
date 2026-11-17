<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    size?: string | number;
    label?: string;
    fullscreen?: boolean;
  }>(),
  {
    size: 28,
    label: "",
    fullscreen: false,
  }
);

const numericSize = computed(() => Math.max(14, Number(props.size) || 28));
// Snap displacement to integer pixels so 1px edges stay razor-sharp at keyframe stops
const shiftPx = computed(() =>
  Math.max(3, Math.round(numericSize.value * 0.18))
);
const overhangPx = computed(() =>
  Math.max(4, Math.round(numericSize.value * 0.22))
);
</script>

<template>
  <div
    role="status"
    :aria-label="props.label || '加载中'"
    class="elysium-ui elysium-ui__loader select-none"
    :class="{
      'elysium-ui__loader--fullscreen': props.fullscreen,
      'elysium-ui__loader--inline': !props.fullscreen,
    }"
  >
    <div
      class="elysium-ui__loader-body flex flex-col items-center justify-center gap-3.5"
    >
      <span
        class="elysium-ui__spinner inline-block relative"
        :style="{
          '--s': `${numericSize}px`,
          '--shift': `${shiftPx}px`,
          '--overhang': `${overhangPx}px`,
        }"
      >
        <!-- Stationary registration crosshairs -->
        <span
          aria-hidden="true"
          class="ely-spinner__line ely-spinner__line--top"
        />
        <span
          aria-hidden="true"
          class="ely-spinner__line ely-spinner__line--left"
        />
        <span
          aria-hidden="true"
          class="ely-spinner__line ely-spinner__line--bottom"
        />
        <span
          aria-hidden="true"
          class="ely-spinner__line ely-spinner__line--right"
        />

        <!-- Alternating off-register matte gouache plate -->
        <span
          aria-hidden="true"
          class="ely-spinner__plate ely-spinner__plate--wash"
        />

        <!-- Counter-shifting ink wireframe plate with solid registration anchor -->
        <span
          aria-hidden="true"
          class="ely-spinner__plate ely-spinner__plate--ink"
        >
          <span class="ely-spinner__anchor" />
        </span>
      </span>

      <span v-if="props.label" class="elysium-ui__loader-label">
        {{ props.label }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.elysium-ui__loader {
  &--inline {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  // Fullscreen route-transition overlay: matte paper veil + off-register gouache plate
  &--fullscreen {
    position: fixed;
    inset: 0;
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-accent-transparent);

    .elysium-ui__loader-body {
      padding: 28px 38px;
      background-color: var(--gouache-paper);
      border: 1px solid var(--color-accent-border-300);
      box-shadow: 5px 5px 0 0 var(--gouache-wash);
    }
  }

  &-label {
    font-family: var(--font-family-base);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-accent-text-tertiary);
  }
}

.elysium-ui__spinner {
  width: var(--s);
  height: var(--s);
  margin: var(--overhang);
}

.ely-spinner__line {
  position: absolute;
  background-color: var(--color-accent-border-300);
  pointer-events: none;

  &--top {
    top: 0;
    left: calc(var(--overhang) * -1);
    width: calc(100% + var(--overhang));
    height: 1px;
  }

  &--left {
    top: calc(var(--overhang) * -1);
    left: 0;
    width: 1px;
    height: calc(100% + var(--overhang));
  }

  &--bottom {
    bottom: 0;
    right: calc(var(--overhang) * -1);
    width: calc(58% + var(--overhang));
    height: 1px;
  }

  &--right {
    bottom: calc(var(--overhang) * -1);
    right: 0;
    width: 1px;
    height: calc(58% + var(--overhang));
  }
}

.ely-spinner__plate {
  position: absolute;
  inset: 3px;
  pointer-events: none;
  will-change: transform;

  &--wash {
    background-color: color-mix(
      in srgb,
      var(--gouache-pigment) 36%,
      var(--gouache-wash)
    );
    animation: plate-wash-dance 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite;
  }

  &--ink {
    border: 1px solid var(--color-accent);
    background-color: transparent;
    animation: plate-ink-dance 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite;
  }
}

.ely-spinner__anchor {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 36%;
  height: 36%;
  background-color: var(--gouache-ink);
}

// 4-beat printmaking registration choreography:
// Diagonal off-register -> horizontal swap -> inverted diagonal -> snap into (0, 0) register
@keyframes plate-wash-dance {
  0%,
  100% {
    transform: translate3d(var(--shift), var(--shift), 0);
  }
  25% {
    transform: translate3d(calc(var(--shift) * -1), var(--shift), 0);
  }
  50% {
    transform: translate3d(calc(var(--shift) * -1), calc(var(--shift) * -1), 0);
  }
  75%,
  82% {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes plate-ink-dance {
  0%,
  100% {
    transform: translate3d(
      calc(var(--shift) * -0.6),
      calc(var(--shift) * -0.6),
      0
    );
  }
  25% {
    transform: translate3d(
      calc(var(--shift) * 0.6),
      calc(var(--shift) * -0.6),
      0
    );
  }
  50% {
    transform: translate3d(
      calc(var(--shift) * 0.6),
      calc(var(--shift) * 0.6),
      0
    );
  }
  75%,
  82% {
    transform: translate3d(0, 0, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ely-spinner__plate--wash {
    animation: none !important;
    transform: translate3d(3px, 3px, 0) !important;
  }

  .ely-spinner__plate--ink {
    animation: none !important;
    transform: none !important;
  }
}
</style>
