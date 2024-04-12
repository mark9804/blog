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
  <div class="home-page flex p-[24px] gap-[48px]">
    <ProfileCard :props="props"/>
    <TableOfContents class="home-page__toc" />
  </div>
</template>

<style scoped lang="scss">
.home-page {
  display: flex;
  width: 100vw;
  width: 100dvw;

  &__toc {
    flex: 1;
  }
}

@media (max-width: 475px) {
  .home-page {
    flex-direction: row;
  }
}
</style>
