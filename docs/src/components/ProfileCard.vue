<script setup lang="ts">
import { ref } from "vue";
import { useWindowSize } from "@vueuse/core";
import { ClickOutside as vClickOutside } from "element-plus";
const { width } = useWindowSize();

defineProps<{
  props: { name: string; avatar: string; bio: string; email: string };
}>();

const showFullProfileCard = ref(false);

function onClickOutside() {
  showFullProfileCard.value = false;
}
</script>
<template>
  <div
    v-if="width >= 475"
    class="flex flex-col items-center gap-[24px] p-[24px] rounded-lg border-1 border-solid border-fill h-full w-fit min-w-[256px]"
  >
    <img
      class="w-[100px] h-[100px] rounded-full"
      :src="props.avatar"
      alt="avatar"
    />
    <div class="flex flex-col gap-[8px]">
      <h1 class="text-2xl font-bold text-center">{{ props.name }}</h1>
      <p class="text-3 text-center">{{ props.bio }}</p>
      <a
        class="flex items-center justify-center gap-[4px]"
        :href="'mailto:' + props.email"
      >
        <icon-email />
        {{ props.email }}</a
      >
    </div>
  </div>
  <div v-else class="fixed top-[84px] right-[24px] shadow-std rounded-full z-2">
    <transition name="namecard-transition">
      <img
        class="w-[48px] h-[48px] rounded-full"
        :src="props.avatar"
        alt="avatar"
        @click="showFullProfileCard = true"
        v-if="!showFullProfileCard"
      />
    </transition>
    <transition name="namecard-transition">
      <div
        v-click-outside="onClickOutside"
        v-if="showFullProfileCard"
        class="mobile-profile-card fixed top-[72px] right-[12px] shadow-std rounded-lg p-[20px] z-10 max-w-[75vw] flex flex-col items-end"
      >
        <img
          class="w-[48px] h-[48px] rounded-full"
          :src="props.avatar"
          alt="avatar"
        />
        <h1 class="text-2xl font-bold text-center">{{ props.name }}</h1>
        <p class="text-3 text-center">{{ props.bio }}</p>
        <a
          class="flex items-center justify-center gap-[4px]"
          :href="'mailto:' + props.email"
        >
          <icon-email />
          {{ props.email }}</a
        >
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.mobile-profile-card {
  background-color: var(--color-fill-base);
}

.namecard-transition-enter-active,
.namecard-transition-leave-active {
  transition: all 0.175s linear;
}

.namecard-transition-enter-from,
.namecard-transition-leave-to {
  opacity: 0;
  transform: scale3d(0, 0, 0);
  transform-origin: top right;
}
</style>
