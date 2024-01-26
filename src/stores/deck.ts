export const useDeckStore = defineStore('deck', () => {
  const pick_deck_id = ref('');
  const isCopy = ref(false);
  const searchCardsId = ref('');

  return {
    pick_deck_id,
    isCopy,
    searchCardsId,
  };
});
