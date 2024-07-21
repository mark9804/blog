import { defineStore } from "pinia";

export const useCustomStore = defineStore({
  id: "vitepress-custom-store",
  // @ts-ignore
  persist: true,
  state: () => ({
    showComments: false,
  }),
  getters: {
    getCommentsVisibility: state => state.showComments,
  },
  actions: {
    toggleCommentsVisibility() {
      this.showComments = !this.showComments;
    },
  },
});
