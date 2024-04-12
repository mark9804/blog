<script setup lang="ts">
import TableOfContents from "./TableOfContents.vue";
import ProfileCard from './ProfileCard.vue'

import { useData } from "vitepress";

const { theme } = useData();
// @ts-ignore
let props;
if (theme.value.userProfile) {
  const { name, avatar, bio, email } = theme.value.userProfile;
  props = { name, avatar, bio, email };
}
</script>

<template>
  <div class="home-page w-[100dvw] pl-[48px] pr-[48px] pt-[24px] flex flex-col items-center">
    <div class="max-w-[1200px] flex gap-[48px] w-full">
      <ProfileCard :props="props"/>
      <TableOfContents class="home-page__toc" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@media (max-width: 475px) {
  .home-page {
    flex-direction: row;
  }
}
</style>
