import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { unique, sift } from "radash";

export const useCustomStore = defineStore(
  "vitepress-custom-store",
  () => {
    const showComments = ref(false);
    const getCommentsVisibility = computed(() => showComments.value);
    function toggleCommentsVisibility() {
      showComments.value = !showComments.value;
    }

    const selectedTags = ref<string[]>([]);
    const getSelectedTags = computed(() => selectedTags.value);
    function setSelectedTags(tags: string[]) {
      selectedTags.value = unique(sift(tags));
    }
    function pushSelectedTags(tags: string[] | string) {
      setSelectedTags([
        ...selectedTags.value,
        ...(Array.isArray(tags) ? tags : [tags]),
      ]);
    }
    function removeSelectedTags(tag: string) {
      setSelectedTags(getSelectedTags.value.filter(t => t !== tag));
    }
    function resetTags() {
      setSelectedTags([]);
    }

    return {
      showComments,
      getCommentsVisibility,
      toggleCommentsVisibility,
      selectedTags,
      getSelectedTags,
      setSelectedTags,
      pushSelectedTags,
      removeSelectedTags,
      resetTags,
    };
  },
  {
    // @ts-ignore
    persist: true,
  }
);
