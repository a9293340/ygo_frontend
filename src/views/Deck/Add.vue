<script setup lang="ts">
import type { CardsList } from "module-types";
import type { CardListType } from "request-data-types";
import type { HasTotalRes } from "response-data-types";

const cardsList = ref<[] | CardsList>([]);
const limit = ref(20);
const page = ref(0);

const getCardsList = (cards: {
	cards: HasTotalRes<CardsList>;
	listQuery: CardListType;
}) => {
	cardsList.value = cards.cards.list;
	console.log(cardsList.value);
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
			<DeckWin :cards-list.sync="cardsList" />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.deck-add {
	min-height: calc(100vh - 104px);
	padding: 0;
	.main-win {
		@apply w-full hidden pl-20 pr-20 pb-5 pt-5 xl:block;
		height: calc(100vh - 104px - 190px);
	}
}
</style>
