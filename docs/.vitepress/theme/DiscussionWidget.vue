<script setup lang="ts">
import { computed } from "vue";
import { useCustomStore } from "../piniaStore";
import DiscusWidget from "./DiscusWidget.vue";

const customStore = useCustomStore();
const isCommentVisible = computed({
  get: () => customStore.getCommentsVisibility,
  set: () => customStore.toggleCommentsVisibility(),
});
</script>

<template>
  <div class="comment-switch">
    <span>展示评论</span>
    <a-switch v-model="isCommentVisible" />
  </div>
  <DiscusWidget v-if="isCommentVisible" />
</template>

<style scoped lang="scss">
.comment-switch {
  display: flex;
  justify-content: flex-end;
  margin-top: 40px;
  gap: 1rem;
}
#disqus_thread {
  margin-top: 40px;
}
</style>
