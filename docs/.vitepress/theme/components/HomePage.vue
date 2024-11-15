<script setup lang="ts">
import { computed } from "vue";
import TableOfContents from "./deprecated/TableOfContents.vue";
import ProfileCard from "./deprecated/ProfileCard.vue";
import { useData } from "vitepress";

const { theme } = useData();
const props = computed(() => {
  if (theme.value.userProfile) {
    const { name, avatar, bio, email, social } = theme.value.userProfile;
    return { name, avatar, bio, email, social };
  }
  return null;
});
</script>

<template>
  <div class="w-[100dvw] flex flex-col items-center">
    <ElyProfile
      :name="props?.name"
      :avatar="props?.avatar"
      :bio="props?.bio"
      :email="props?.email"
      :social="props?.social"
    />
    <TableOfContents class="home-page__toc" />
  </div>
</template>

<style scoped lang="scss">
@media (max-width: 475px) {
  .home-page {
    flex-direction: column;
  }
}
</style>
