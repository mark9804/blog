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
  const currentUrl = new URL(window.location.href);
  const currentKeywords =
    currentUrl.searchParams.get("keywords")?.split(",").filter(Boolean) || [];

  // 如果标签已经在搜索列表中，就不添加
  if (!currentKeywords.includes(tag)) {
    const newKeywords = [...currentKeywords, tag];
    router.go(
      withBase(`/tags/?keywords=${encodeURIComponent(newKeywords.join(","))}`)
    );
  }
}
</script>

<template>
  <a-tag
    color="arcoblue"
    class="pointer-events-auto cursor-pointer"
    @click="searchTags(props.tag)"
    :size="props.size"
  >
    <template #icon>
      <icon-tag />
    </template>
    {{ props.tag }}
  </a-tag>
</template>
