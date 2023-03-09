// import { defineStore } from "pinia";
// import { computed, ref } from "vue";

export const useCounterStore = defineStore("counter", () => {
  const count = ref(0);

  const addCount = () => count.value++;
  const doubleCount = computed(() => count.value * 2);

  return {
    count,
    addCount,
    doubleCount,
  };
});
