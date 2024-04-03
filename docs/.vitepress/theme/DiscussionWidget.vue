<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';

onMounted(() => {
  const script = document.createElement('script');
  script.src = 'https://mark9804.disqus.com/embed.js';
  script.setAttribute('data-timestamp', String(+new Date()));
  document.head.appendChild(script);
});

onBeforeUnmount(() => {
  const disqusThread = document.getElementById('disqus_thread');
  if (disqusThread) {
    disqusThread.innerHTML = '';
  }
});
</script>

<template>
  <div id="disqus_thread" />
  <noscript
    >Please enable JavaScript to view the
    <a href="https://disqus.com/?ref_noscript"
      >comments powered by Disqus.</a
    ></noscript
  >
</template>

<style scoped lang="scss">
#disqus_thread {
  margin-top: 40px;
}
</style>
