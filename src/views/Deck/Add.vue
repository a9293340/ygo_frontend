<script setup lang="ts">
import type { CardsList } from "module-types";
import type { CardListType } from "request-data-types";
import type { HasTotalRes } from "response-data-types";
import DeckWin from "@/components/Deck/DeckWin.vue";

const cardsList = ref<[] | CardsList>([]);
const limit = ref(20);
const page = ref(0);
const trigger = ref(0);
const total = ref(0);

const getCardsList = (cards: {
	cards: HasTotalRes<CardsList>;
	listQuery: CardListType;
}) => {
	if (!cards.listQuery.page) {
		cardsList.value = [];
		trigger.value++;
	}
	cardsList.value = [...cardsList.value, ...cards.cards.list];
	total.value = cards.cards.total;
	page.value = cards.listQuery.page;
};

const callApi = () => {
	page.value = page.value + 1;
};
</script>

<template>
	<div class="deck-add">
		<SearchCards
			@get:data="getCardsList"
			v-model:page="page"
			v-model:limit="limit"
		/>
		<div class="main-win">
			<DeckWin
				:total="total"
				:cards-list.sync="cardsList"
				@call:api="callApi"
				:trigger.sync="trigger"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.deck-add {
	min-height: calc(100vh - 104px);
}
</style>
