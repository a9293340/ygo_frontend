export const useDeckStore = defineStore('deck', () => {
  const pick_deck_id = ref('');
  const isCopy = ref(false);

  return {
    pick_deck_id,
    isCopy,
  };
});
