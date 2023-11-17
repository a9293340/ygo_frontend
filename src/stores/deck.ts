// import { defineStore } from "pinia";
// import { computed, ref } from "vue";

export const useDeckStore = defineStore("deck", () => {
	const pick_deck_id = ref("");

	return {
		pick_deck_id,
	};
});
