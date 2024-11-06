<script setup lang="ts">
import { withBase, useRouter } from "vitepress";

const props = withDefaults(
  defineProps<{
    tag: string;
    size?: "small" | "medium" | "large";
  }>(),
  {
    size: "medium",
  }
);

const router = useRouter();

function searchTags(tag: string) {
  router.go(withBase(`/tags/?keyword=${encodeURIComponent(tag)}`));
}
</script>

<template>
  <a-tag
    color="arcoblue"
    class="span-tag cursor-pointer"
    @click="searchTags(props.tag)"
    :size="props.size"
  >
    <template #icon>
      <icon-tag />
    </template>
    {{ props.tag }}
  </a-tag>
</template>
