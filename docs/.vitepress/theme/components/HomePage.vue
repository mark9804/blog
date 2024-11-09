<script setup lang="ts">
import { computed } from "vue";
import TableOfContents from "./TableOfContents.vue";
import ProfileCard from "./ProfileCard.vue";
import { useData } from "vitepress";

const { theme } = useData();
const props = computed(() => {
  if (theme.value.userProfile) {
    const { name, avatar, bio, email } = theme.value.userProfile;
    return { name, avatar, bio, email };
  }
  return null;
});
</script>

<template>
  <div
    class="w-[100dvw] pl-[48px] pr-[48px] pt-[24px] flex flex-col items-center"
  >
    <div class="home-page max-w-[1200px] flex gap-[48px] w-full">
      <ProfileCard :props="props" />
      <TableOfContents class="home-page__toc" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@media (max-width: 475px) {
  .home-page {
    flex-direction: column;
  }
}
</style>
