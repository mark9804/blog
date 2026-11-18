<script setup lang="ts">
import {
  Comment,
  Fragment,
  cloneVNode,
  computed,
  provide,
  useSlots,
  type VNode,
  type VNodeArrayChildren,
} from "vue";
import type { ImageBase } from "./types/ImageBase";
import { GALLERY_INJECTION_KEY } from "./types/GalleryContext";

defineProps<{
  name?: string;
}>();

// Extract child component VNodes in reading order, unwrapping <p> or Fragment nodes
// inserted by markdown-it around inline images.
function extractComponentVNodes(
  vnodes: VNodeArrayChildren | undefined
): VNode[] {
  if (!vnodes) return [];
  const result: VNode[] = [];
  for (const vn of vnodes) {
    if (Array.isArray(vn)) {
      result.push(...extractComponentVNodes(vn));
      continue;
    }
    if (typeof vn !== "object" || vn === null || vn.type === Comment) {
      continue;
    }
    if (
      (typeof vn.type === "object" && vn.type !== null) ||
      typeof vn.type === "function"
    ) {
      result.push(vn);
    } else if (
      (vn.type === Fragment || typeof vn.type === "string") &&
      Array.isArray(vn.children)
    ) {
      result.push(...extractComponentVNodes(vn.children));
    }
  }
  return result;
}

const slots = useSlots();

const orderedChildren = computed(() =>
  extractComponentVNodes(slots.default?.())
);

const orderedImages = computed<ImageBase[]>(() =>
  orderedChildren.value
    .map(vn => vn.props?.image as ImageBase | undefined)
    .filter((img): img is ImageBase => Boolean(img))
);

provide(GALLERY_INJECTION_KEY, { images: orderedImages });

// Distribute images round-robin into 3 columns while preserving reading-order index
const columns = computed(() => {
  const buckets: VNode[][] = [[], [], []];
  orderedChildren.value.forEach((child, i) => {
    buckets[i % 3].push(cloneVNode(child, { galleryIndex: i }));
  });
  return buckets.filter(col => col.length > 0);
});
</script>

<template>
  <figure class="elysium-ui elysium-ui__gallery m-0 flex flex-col gap-2">
    <div class="elysium-ui elysium-ui__gallery__img-container flex gap-2">
      <ElySpace
        v-for="(col, colIndex) in columns"
        :key="colIndex"
        size="small"
        direction="vertical"
        class="flex-1 min-w-0"
      >
        <component :is="child" v-for="(child, i) in col" :key="i" />
      </ElySpace>
    </div>
    <figcaption
      v-if="name && name.length > 0"
      class="text-sm text-[var(--color-accent-text-tertiary)] text-center"
    >
      {{ name }}
    </figcaption>
  </figure>
</template>

<style scoped lang="scss">
.elysium-ui__gallery {
  container-type: inline-size;

  @container (max-width: 375px) {
    &__img-container {
      flex-direction: column;
    }
  }
}
</style>
