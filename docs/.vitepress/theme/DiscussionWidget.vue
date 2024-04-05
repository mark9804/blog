<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed } from "vue";
import { useCustomStore } from "../piniaStore";
import AronaSwitch from "../../src/components/AronaSwitch.vue";

const customStore = useCustomStore();
const isCommentVisible = computed({
  get: () => customStore.getCommentsVisibility,
  set: () => customStore.toggleCommentsVisibility(),
});

function initDisqusComments() {
  const script = document.createElement("script");
  script.src = "https://mark9804.disqus.com/embed.js";
  script.setAttribute("data-timestamp", String(+new Date()));
  document.head.appendChild(script);
}

onMounted(() => {
  if (isCommentVisible.value) {
    initDisqusComments();
  }
});

function destroyDisqusComments() {
  const disqusThread = document.getElementById("disqus_thread");
  if (disqusThread) {
    disqusThread.innerHTML = "";
  }
}

onBeforeUnmount(() => {
  destroyDisqusComments();
});

function handleCheckboxChange(value: boolean) {
  isCommentVisible.value = value;
  if (value) {
    initDisqusComments();
  } else {
    destroyDisqusComments();
  }
}
</script>

<template>
  <div class="comment-switch">
    <span>展示评论</span>
    <AronaSwitch
      :checked="isCommentVisible"
      @update:checked="handleCheckboxChange"
    />
  </div>
  <div id="disqus_thread" />
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
