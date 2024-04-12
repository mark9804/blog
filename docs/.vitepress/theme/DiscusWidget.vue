<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  const script = document.createElement("script");
  script.src = "https://mark9804.disqus.com/embed.js";
  script.setAttribute("data-timestamp", String(+new Date()));
  document.head.appendChild(script);
})
</script>

<template>
  <div class="discus-widget">
    <div id="disqus_thread"></div>
  </div>
</template>

<style scoped lang="scss"></style>
