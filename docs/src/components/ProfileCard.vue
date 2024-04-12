<script setup lang="ts">
defineProps<{
  props: { name: string; avatar: string; bio: string; email: string };
}>();
</script>

<template>
  <div class="flex flex-col items-center gap-[24px] p-[24px] rounded-lg shadow-std h-full">
    <img
      class="w-[100px] h-[100px] rounded-full"
      :src="props.avatar"
      alt="avatar"
    />
    <div class="flex flex-col gap-[8px]">
      <h1 class="text-2xl font-bold text-center">{{ props.name }}</h1>
      <p class="text-center">{{ props.bio }}</p>
      <a class="text-center" :href="'mailto:' + props.email">{{
        props.email
      }}</a>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
