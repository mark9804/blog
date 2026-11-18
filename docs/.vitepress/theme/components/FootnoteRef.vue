<script setup lang="ts">
import { ref, watch } from "vue";
import ElyTooltip from "./ElysiumUI/ElyTooltip.vue";

const props = defineProps<{
  id: string;
  caption: string;
  suffix: string;
}>();

const footnoteContent = ref("");
const hasFootnote = ref(true);
let resolved = false;

function ensureFootnoteContent() {
  if (resolved || typeof document === "undefined") return;
  resolved = true;

  const el = document.getElementById(`footnote${props.id}`);
  if (!el) {
    hasFootnote.value = false;
    return;
  }

  // Clone to avoid mutating page DOM, then strip duplicate IDs and backref links
  const clone = el.cloneNode(true) as HTMLElement;
  clone.removeAttribute("id");
  clone.querySelectorAll("[id]").forEach(node => node.removeAttribute("id"));
  clone.querySelectorAll(".footnote-backref").forEach(a => a.remove());

  const html = clone.innerHTML.trim();
  footnoteContent.value = html;
  hasFootnote.value = html.length > 0;
}

watch(
  () => props.id,
  () => {
    resolved = false;
    footnoteContent.value = "";
    hasFootnote.value = true;
  }
);
</script>

<template>
  <sup class="footnote-ref">
    <ElyTooltip v-if="hasFootnote" position="bl" :close-delay="400">
      <a
        :href="`#footnote${id}`"
        @pointerenter="ensureFootnoteContent"
        @focus="ensureFootnoteContent"
        >{{ caption }}</a
      >
      <template #content>
        <span v-html="footnoteContent"></span>
      </template>
    </ElyTooltip>
    <a v-else :href="`#footnote${id}`">{{ caption }}</a>
    <a class="footnote-anchor" :id="`footnote-ref${id}${suffix}`"></a>
  </sup>
</template>
