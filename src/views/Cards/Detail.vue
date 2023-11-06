<script setup lang="ts">
import type { CardListType } from "request-data-types";
import type { Cards, CardsList } from "module-types";
import type { HasTotalRes } from "response-data-types";
import { callApi } from "@/util/api";
import { decode } from "@/util";
import "chartjs-adapter-date-fns";

const route = useRoute();
const cardInfo = ref<Cards | undefined>();

onMounted(async () => {
	cardInfo.value = decode<HasTotalRes<CardsList>>(
		(
			await callApi<CardListType>(
				{ page: 0, limit: 1, filter: { id: route.params.id as string } },
				"cards",
				"list",
				false
			)
		).data
	).list[0];
	console.log(cardInfo.value);
});
</script>

<template>
	<div class="cards-detail">
		<PriceChart
			v-if="cardInfo && Array.isArray(cardInfo?.price_info)"
			:price="cardInfo?.price_info"
		/>
	</div>
</template>

<style lang="scss" scoped>
.cards-detail {
}
</style>
