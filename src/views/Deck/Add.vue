<script setup lang="ts">
import type { CardsList } from "module-types";
import type { CardListType } from "request-data-types";
import type { HasTotalRes } from "response-data-types";

const getCardsList = (cards: {
	cards: HasTotalRes<CardsList>;
	listQuery: CardListType;
}) => {
	console.log(cards);
};
</script>

<template>
	<div class="deck-add">
		<SearchCards @get:data="getCardsList" />
	</div>
</template>

<style lang="scss" scoped>
.deck-add {
	min-height: calc(100vh - 104px);
	padding: 0 0 30px;
}
</style>
