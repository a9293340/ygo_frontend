<script setup lang="ts">
import type { HasTotalRes } from "response-data-types";
import type { DeckListType } from "request-data-types";
import type { DeckList } from "module-types";
import { decode, removeNullAndEmptyString } from "@/util";
import { callApi } from "@/util/api";

const deckList = ref<DeckList>([]);
const total = ref(0);
const listQuery = ref<DeckListType>({
	page: 0,
	limit: 20,
	filter: {
		admin_id: "",
		title: "",
		begin_date: "",
		end_date: "",
	},
});

const getList = async () => {
	const data = decode<HasTotalRes<DeckList>>(
		(
			await callApi<DeckListType>(
				removeNullAndEmptyString(listQuery.value),
				"deck",
				"deckList",
				false
			)
		).data
	);
	deckList.value = data.list;
	total.value = data.total;
};

onMounted(async () => {
	await getList();
	console.log(deckList.value);
});
</script>

<template>
	<div class="deck-list"></div>
</template>

<style scoped>
.deck-list {
	min-height: calc(100vh - 104px);
}
</style>
