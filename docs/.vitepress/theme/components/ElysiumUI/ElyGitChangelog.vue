<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useData } from "vitepress";
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  ChevronDown,
  History,
} from "@lucide/vue";
import { GITHUB_REPO_URL } from "../../../constants";
import { data as changelogMap } from "../../loaders/changelog.data";
import type { GitCommitEntry } from "../../types/Changelog";
import { formatDateTime, formatRelativeTime } from "../../utils/timeUtils";

interface SubjectSegment {
  text: string;
  issueNumber?: string;
}

const { page, frontmatter } = useData();

const isExpanded = ref(false);
const sortAscending = ref(false);
const relativeLabel = ref("");

const currentDocPath = computed(
  () => page.value.filePath || page.value.relativePath || ""
);

const commits = computed<GitCommitEntry[]>(() => {
  if (frontmatter.value?.gitChangelog === false) return [];
  const key = currentDocPath.value;
  return key ? (changelogMap[key] ?? []) : [];
});

const latestCommit = computed<GitCommitEntry | undefined>(
  () => commits.value[0]
);

const displayedCommits = computed<GitCommitEntry[]>(() =>
  sortAscending.value ? [...commits.value].reverse() : commits.value
);

function formatShortDate(timestamp: number): string {
  return formatDateTime(timestamp).slice(0, 10);
}

const latestTimeDisplay = computed(() => {
  if (!latestCommit.value) return "";
  return relativeLabel.value || formatShortDate(latestCommit.value.timestamp);
});

function syncRelativeTime() {
  if (typeof window === "undefined" || !latestCommit.value) {
    relativeLabel.value = "";
    return;
  }
  relativeLabel.value = formatRelativeTime(latestCommit.value.timestamp);
}

function parseSubjectSegments(subject: string): SubjectSegment[] {
  const segments: SubjectSegment[] = [];
  const pattern = /#(\d+)\b/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null = null;

  while ((match = pattern.exec(subject)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: subject.slice(lastIndex, match.index) });
    }
    segments.push({ text: match[0], issueNumber: match[1] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < subject.length) {
    segments.push({ text: subject.slice(lastIndex) });
  }

  return segments.length > 0 ? segments : [{ text: subject }];
}

watch(currentDocPath, () => {
  isExpanded.value = false;
  sortAscending.value = false;
  syncRelativeTime();
});

onMounted(syncRelativeTime);
</script>

<template>
  <section
    v-if="commits.length > 0"
    class="ely-changelog vp-raw select-none"
    aria-label="页面修订历史"
  >
    <div
      role="button"
      tabindex="0"
      :aria-expanded="isExpanded"
      class="ely-changelog__header flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 cursor-pointer"
      :class="{ 'is-expanded': isExpanded }"
      @click="isExpanded = !isExpanded"
      @keydown.enter.prevent="isExpanded = !isExpanded"
      @keydown.space.prevent="isExpanded = !isExpanded"
    >
      <div class="flex items-center gap-2.5 text-xs">
        <History
          :size="14"
          :stroke-width="1.6"
          class="ely-changelog__icon shrink-0"
        />
        <span class="ely-changelog__summary">
          最后编辑于
          <strong class="ely-changelog__time">{{ latestTimeDisplay }}</strong>
        </span>
        <span class="ely-changelog__count">{{ commits.length }} 次修订</span>
      </div>

      <div class="flex items-center gap-2.5 ml-auto text-xs">
        <button
          v-if="isExpanded && commits.length > 1"
          type="button"
          class="ely-changelog__sort inline-flex items-center gap-1 cursor-pointer"
          :title="sortAscending ? '当前：最早优先' : '当前：最新优先'"
          @click.stop="sortAscending = !sortAscending"
        >
          <ArrowUpNarrowWide
            v-if="sortAscending"
            :size="12"
            :stroke-width="1.6"
          />
          <ArrowDownWideNarrow v-else :size="12" :stroke-width="1.6" />
          <span>{{ sortAscending ? "最早" : "最新" }}</span>
        </button>

        <span class="ely-changelog__toggle inline-flex items-center gap-1.5">
          <span class="max-sm:hidden">
            {{ isExpanded ? "收起历史" : "查看完整历史" }}
          </span>
          <ChevronDown
            :size="14"
            :stroke-width="1.6"
            class="ely-changelog__chevron"
            :class="{ 'is-open': isExpanded }"
          />
        </span>
      </div>
    </div>

    <div
      class="ely-changelog__panel"
      :class="{ 'is-open': isExpanded }"
      :aria-hidden="!isExpanded"
    >
      <div class="ely-changelog__panel-inner">
        <ol class="ely-changelog__list m-0 list-none px-4 py-3 select-text">
          <li
            v-for="commit in displayedCommits"
            :key="commit.hash"
            class="ely-changelog__item relative flex flex-wrap items-start gap-x-2.5 gap-y-1 py-1.5"
          >
            <span
              class="ely-changelog__lead inline-flex items-center gap-3 shrink-0"
            >
              <span
                aria-hidden="true"
                class="ely-changelog__node"
                :class="{
                  'is-latest': commit.hash === latestCommit?.hash,
                }"
              />

              <a
                :href="`${GITHUB_REPO_URL}/commit/${commit.hash}`"
                target="_blank"
                rel="noopener noreferrer"
                class="ely-changelog__hash shrink-0"
              >
                <code>{{ commit.shortHash }}</code>
              </a>
            </span>

            <span class="ely-changelog__subject flex-1 min-w-[180px]">
              <template
                v-for="(seg, idx) in parseSubjectSegments(commit.subject)"
                :key="idx"
              >
                <a
                  v-if="seg.issueNumber"
                  :href="`${GITHUB_REPO_URL}/issues/${seg.issueNumber}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="ely-changelog__issue"
                >
                  {{ seg.text }}
                </a>
                <template v-else>{{ seg.text }}</template>
              </template>
            </span>

            <time
              class="ely-changelog__date shrink-0 ml-auto"
              :datetime="new Date(commit.timestamp).toISOString()"
            >
              {{ formatShortDate(commit.timestamp) }}
            </time>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.ely-changelog {
  position: relative;
  font-family: var(--font-family-base);
  background-color: var(--gouache-paper);
  border: 1px solid var(--color-accent-border-200);
  box-shadow: 4px 4px 0 0
    color-mix(in srgb, var(--gouache-wash) 72%, var(--gouache-paper));

  // Top-left overhanging registration crosshair
  &::before,
  &::after {
    content: "";
    position: absolute;
    background-color: var(--color-accent-border-400);
    pointer-events: none;
  }

  &::before {
    top: -1px;
    left: -7px;
    width: 16px;
    height: 1px;
  }

  &::after {
    top: -7px;
    left: -1px;
    width: 1px;
    height: 16px;
  }

  &__header {
    background-color: color-mix(
      in srgb,
      var(--gouache-wash) 34%,
      var(--gouache-paper)
    );
    transition: background-color 0.2s ease;

    &:hover {
      background-color: color-mix(
        in srgb,
        var(--gouache-wash) 52%,
        var(--gouache-paper)
      );
    }

    &.is-expanded {
      border-bottom: 1px solid var(--color-accent-border-200);
    }
  }

  &__icon {
    color: var(--color-accent);
  }

  &__summary {
    color: var(--color-accent-text-secondary);
  }

  &__time {
    font-weight: 600;
    color: var(--gouache-ink);
  }

  // Hollow paper badge punching through the gouache header wash
  &__count {
    padding: 1px 7px;
    font-size: 11px;
    font-weight: 500;
    color: var(--color-accent);
    background-color: var(--gouache-paper);
  }

  &__sort {
    padding: 2px 7px;
    font-size: 11px;
    color: var(--color-accent-text-secondary);
    background-color: var(--gouache-paper);
    border: 1px solid var(--color-accent-border-200);
    transition:
      background-color 0.2s ease,
      color 0.2s ease,
      border-color 0.2s ease;

    &:hover {
      background-color: var(--color-accent);
      border-color: var(--color-accent);
      color: var(--gouache-paper);
    }
  }

  &__toggle {
    color: var(--color-accent-text-secondary);
    transition: color 0.2s ease;

    .ely-changelog__header:hover & {
      color: var(--gouache-ink);
    }
  }

  &__chevron {
    transition: transform 0.26s cubic-bezier(0.22, 1, 0.36, 1);

    &.is-open {
      transform: rotate(180deg);
    }
  }

  &__panel {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.26s cubic-bezier(0.22, 1, 0.36, 1);

    &.is-open {
      grid-template-rows: 1fr;
    }
  }

  &__panel-inner {
    overflow: hidden;
  }

  &__item {
    line-height: 22px;

    // Continuous 1px timeline spine aligned flush with first tag's top (7px) and last tag's bottom (27px)
    &::before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 2px;
      width: 1px;
      background-color: var(--color-accent-border-200);
      pointer-events: none;
    }

    &:first-child::before {
      top: 7px;
    }

    &:last-child::before {
      bottom: calc(100% - 27px);
    }
  }

  &__lead {
    height: 22px;
  }

  &__node {
    position: relative;
    z-index: 1;
    width: 5px;
    height: 5px;
    flex-shrink: 0;
    background-color: var(--gouache-paper);
    border: 1px solid var(--color-accent-border-400);

    &.is-latest {
      background-color: var(--color-accent);
      border-color: var(--color-accent);
    }
  }

  &__hash {
    display: inline-flex;
    align-items: center;
    text-decoration: none;

    code {
      display: inline-flex;
      align-items: center;
      height: 20px;
      padding: 0 6px;
      font-family: var(--font-family-mono);
      font-size: 11.5px;
      line-height: 1;
      color: var(--color-accent-code);
      background-color: color-mix(
        in srgb,
        var(--gouache-wash) 45%,
        var(--gouache-paper)
      );
      border: 1px solid var(--color-accent-border-200);
      transition:
        background-color 0.2s ease,
        color 0.2s ease,
        border-color 0.2s ease;
    }

    &:hover code {
      background-color: var(--color-accent);
      border-color: var(--color-accent);
      color: var(--gouache-paper);
    }
  }

  &__subject {
    font-size: 13px;
    line-height: 22px;
    color: var(--color-accent-text-primary);
  }

  &__issue {
    color: var(--color-accent);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  &__date {
    font-size: 11.5px;
    line-height: 22px;
    font-variant-numeric: tabular-nums;
    color: var(--color-accent-text-tertiary);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ely-changelog__header,
  .ely-changelog__chevron,
  .ely-changelog__panel,
  .ely-changelog__sort,
  .ely-changelog__hash code {
    transition: none !important;
  }
}
</style>
