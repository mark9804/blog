<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = defineProps<{
  id: string;
  caption: string;
  suffix: string;
}>();

const footnoteContent = ref("");

onMounted(() => {
  const el = document.getElementById(`footnote${props.id}`);
  if (!el) return;

  // Clone to avoid mutating the actual DOM, then strip backref anchors
  const clone = el.cloneNode(true) as HTMLElement;
  clone.querySelectorAll(".footnote-backref").forEach(a => a.remove());
  footnoteContent.value = clone.innerHTML.trim();
});
</script>

<template>
  <sup class="footnote-ref">
    <a-tooltip v-if="footnoteContent" position="bl">
      <a :href="`#footnote${id}`">{{ caption }}</a>
      <template #content>
        <span v-html="footnoteContent"></span>
      </template>
    </a-tooltip>
    <a v-else :href="`#footnote${id}`">{{ caption }}</a>
    <a class="footnote-anchor" :id="`footnote-ref${id}${suffix}`"></a>
  </sup>
</template>
