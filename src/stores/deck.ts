// import { defineStore } from "pinia";
// import { computed, ref } from "vue";

export const useDeckStore = defineStore('deck', () => {
  const admin_id = ref('');

  return {
    admin_id,
  };
});
