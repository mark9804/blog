<script setup lang="ts">
import { computed, type Component } from "vue";
import { useData } from "vitepress";
import { Bot, CircleHelp, PenLine } from "@lucide/vue";
import {
  resolveAiUsageConfig,
  type AiUsage,
  type AiUsageConfig,
  type AiUsageLevel,
} from "../../utils/aiUsageUtils";
import ElyTooltip from "./ElyTooltip.vue";

const props = defineProps<{
  usage: AiUsage;
}>();

const TOTAL_GAUGE_SEGMENTS = 5;

const ICON_MAP: Record<AiUsageLevel, Component> = {
  undisclosed: CircleHelp,
  none: PenLine,
  hint: Bot,
  assist: Bot,
  pair: Bot,
  copilot: Bot,
  auto: Bot,
};

const { theme } = useData();

const config = computed(() =>
  resolveAiUsageConfig(
    (theme.value as { aiUsage?: AiUsageConfig } | undefined)?.aiUsage
  )
);

const meta = computed(() => config.value.levels[props.usage.level]);
const iconComponent = computed(() => ICON_MAP[props.usage.level]);
const resolvedSummary = computed(
  () => props.usage.summary || meta.value.defaultSummary
);
</script>

<template>
  <ElyTooltip position="bl">
    <button
      type="button"
      class="ely-ai-declaration inline-flex items-center gap-1.5 select-none"
      :class="{
        'ely-ai-declaration--undisclosed': props.usage.level === 'undisclosed',
        'ely-ai-declaration--human': props.usage.level === 'none',
      }"
      :aria-label="`${config.prefix}${meta.label}`"
    >
      <component
        :is="iconComponent"
        :size="12"
        :stroke-width="1.5"
        stroke-linecap="square"
        class="ely-ai-declaration__icon"
        :class="{ 'ely-ai-declaration__icon--filled': meta.filledIcon }"
      />
      <span>
        <span class="ely-ai-declaration__prefix">{{ config.prefix }}</span>{{
          meta.label
        }}
      </span>
    </button>

    <template #content>
      <div class="ely-ai-tooltip">
        <div class="ely-ai-tooltip__header">
          <div class="ely-ai-tooltip__title-group">
            <span class="ely-ai-tooltip__title">{{ meta.label }}</span>
            <code class="ely-ai-tooltip__level">{{ props.usage.level }}</code>
          </div>

          <span
            v-if="meta.rank !== null"
            aria-hidden="true"
            class="ely-ai-tooltip__gauge"
            :title="`参与度 ${meta.rank} / ${TOTAL_GAUGE_SEGMENTS}`"
          >
            <span
              v-for="step in TOTAL_GAUGE_SEGMENTS"
              :key="step"
              class="ely-ai-tooltip__gauge-step"
              :class="{ active: step <= meta.rank }"
            />
          </span>
        </div>

        <p class="ely-ai-tooltip__summary">{{ resolvedSummary }}</p>

        <div v-if="props.usage.llms.length > 0" class="ely-ai-tooltip__models">
          <span class="ely-ai-tooltip__models-heading">
            {{ config.modelsHeading }}
          </span>
          <ul class="ely-ai-tooltip__models-list">
            <li
              v-for="(llm, idx) in props.usage.llms"
              :key="`${llm.name}-${idx}`"
              class="ely-ai-tooltip__model-item"
            >
              <code class="ely-ai-tooltip__model-name">{{ llm.name }}</code>
              <span v-if="llm.summary" class="ely-ai-tooltip__model-desc">
                {{ llm.summary }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </ElyTooltip>
</template>

<style scoped lang="scss">
.ely-ai-declaration {
  --bot-eye-cutout: var(--gouache-paper);
  padding: 2px 7px;
  font-family: var(--font-family-base);
  font-size: 12px;
  line-height: 1.4;
  color: var(--color-accent-text-secondary);
  background-color: transparent;
  border: 1px solid var(--color-accent-border-200);
  border-radius: 0;
  cursor: help;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;

  &__icon {
    color: var(--color-accent);
    flex-shrink: 0;

    &--filled {
      :deep(rect) {
        fill: currentColor;
      }

      :deep(path:nth-last-of-type(-n + 2)) {
        stroke: var(--bot-eye-cutout);
        stroke-width: 2;
        transition: stroke 0.2s ease;
      }
    }
  }

  &__prefix {
    color: var(--color-accent-text-tertiary);
  }

  &--human .ely-ai-declaration__icon {
    color: var(--color-accent-text-secondary);
  }

  &--undisclosed {
    border-style: dashed;
    color: var(--color-accent-text-tertiary);

    .ely-ai-declaration__icon {
      color: var(--color-accent-text-tertiary);
    }
  }

  &:hover,
  &:focus-visible,
  &[data-state="delayed-open"],
  &[data-state="instant-open"] {
    --bot-eye-cutout: var(--gouache-wash);
    background-color: var(--gouache-wash);
    border-style: solid;
    border-color: var(--color-accent-border-400);
    color: var(--gouache-ink);
  }

  &:focus-visible {
    outline: 1.5px solid var(--color-accent);
    outline-offset: 2px;
  }
}

.ely-ai-tooltip {
  min-width: 216px;
  max-width: 288px;
  padding: 3px 2px;
  font-family: var(--font-family-base);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-bottom: 6px;
    margin-bottom: 6px;
    border-bottom: 1px solid var(--color-accent-border-200);
  }

  &__title-group {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  &__title {
    font-size: 12px;
    font-weight: 600;
    color: var(--gouache-ink);
  }

  &__level {
    font-family: var(--font-family-mono);
    font-size: 10.5px;
    line-height: 1.3;
    padding: 1px 4px;
    background-color: var(--gouache-wash);
    color: var(--color-accent-code);
  }

  &__gauge {
    display: inline-flex;
    align-items: center;
    gap: 3px;
  }

  &__gauge-step {
    width: 7px;
    height: 4px;
    background-color: var(--gouache-wash);
    border: 1px solid var(--color-accent-border-200);

    &.active {
      background-color: var(--color-accent);
      border-color: var(--color-accent);
    }
  }

  &__summary {
    margin: 0;
    font-size: 12px;
    line-height: 1.55;
    color: var(--color-accent-text-secondary);
  }

  &__models {
    margin-top: 8px;
    padding-top: 7px;
    border-top: 1px dashed var(--color-accent-border-200);
  }

  &__models-heading {
    display: block;
    margin-bottom: 5px;
    font-size: 10.5px;
    font-weight: 500;
    letter-spacing: 0.04em;
    color: var(--color-accent-text-tertiary);
  }

  &__models-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  &__model-item {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 6px;
    font-size: 11.5px;
    line-height: 1.45;
  }

  &__model-name {
    font-family: var(--font-family-mono);
    font-size: 11px;
    padding: 0 5px;
    background-color: var(--gouache-wash);
    border: 1px solid var(--color-accent-border-200);
    color: var(--gouache-ink);
    flex-shrink: 0;
  }

  &__model-desc {
    color: var(--color-accent-text-secondary);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ely-ai-declaration,
  .ely-ai-declaration__icon--filled :deep(path:nth-last-of-type(-n + 2)) {
    transition: none !important;
  }
}
</style>
