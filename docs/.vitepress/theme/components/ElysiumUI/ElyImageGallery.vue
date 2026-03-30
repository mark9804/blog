<script setup lang="ts">
import type { ImageBase } from "./types/ImageBase";
import { provide, reactive, computed, useSlots, type VNode } from "vue";
import { GALLERY_INJECTION_KEY } from "./types/GalleryContext";
import { isElement, isComponent, isArrayChildren } from "./_utils/vueUtils";

defineProps<{
  name?: string;
}>();

// Shared gallery context: child ElyImage components register themselves
// here via inject so they can open a preview scoped to this gallery.
const galleryImages = reactive<ImageBase[]>([]);

function registerImage(image: ImageBase): number {
  const index = galleryImages.length;
  galleryImages.push(image);
  return index;
}

provide(GALLERY_INJECTION_KEY, { images: galleryImages, registerImage });

// Extract component VNodes from slot, digging through wrapper elements
// like <p> that markdown-it inserts around inline content.
function extractComponents(vnodes: VNode[] | undefined): VNode[] {
  if (!vnodes) return [];
  const result: VNode[] = [];
  for (const vn of vnodes) {
    if (isComponent(vn)) {
      result.push(vn);
    } else if (isElement(vn) && Array.isArray(vn.children)) {
      result.push(...extractComponents(vn.children as VNode[]));
    } else if (isArrayChildren(vn, vn.children)) {
      result.push(...extractComponents(vn.children));
    }
  }
  return result;
}

// Distribute slot children round-robin into 3 columns,
// replicating the original masonry layout.
const slots = useSlots();
const columns = computed(() => {
  const children = extractComponents(slots.default?.());
  const result: VNode[][] = [[], [], []];
  children.forEach((child, i) => {
    result[i % 3].push(child);
  });
  return result.filter(col => col.length > 0);
});
</script>

<template>
  <ClientOnly>
    <div class="elysium-ui elysium-ui__gallery flex flex-col gap-2 container">
      <div class="elysium-ui elysium-ui__gallery__img-container flex gap-2">
        <ElySpace
          v-for="(col, colIndex) in columns"
          :key="colIndex"
          size="small"
          direction="vertical"
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
    </div>
  </ClientOnly>
</template>

<style scoped lang="scss">
.elysium-ui__gallery {
  container-type: inline-size;

  // markdown-it wrap inline contents in <p>, which fails flexbox layout
  // We need to deliberately neutralize it in image gallery component
  :deep(p) {
    display: contents;
  }

  @container (max-width: 375px) {
    &__img-container {
      flex-direction: column;
    }
  }
}
</style>
