import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useCustomStore = defineStore(
  "vitepress-custom-store",
  () => {
    const showComments = ref(false);
    const getCommentsVisibility = computed(() => showComments.value);
    function toggleCommentsVisibility() {
      showComments.value = !showComments.value;
    }

    return {
      showComments,
      getCommentsVisibility,
      toggleCommentsVisibility,
    };
  },
  {
    // @ts-ignore
    persist: true,
  }
);
