<script setup lang="ts">
import type { HasTotalRes } from "response-data-types";
import type { DeckListType } from "request-data-types";
import type { DeckList } from "module-types";
import { decode, removeNullAndEmptyString } from "@/util";
import { callApi } from "@/util/api";
import i18n from "@/i18n/index";

const { t } = i18n.global;

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
	<div class="deck-list">
		<div class="search-bar">
			<el-form-item class="deck-list-form" :label="t('deck.set_name')">
				<el-input class="deck-input" />
			</el-form-item>
		</div>
	</div>
</template>
<style lang="scss">
.deck-input.el-input {
	@apply w-48;
	.el-input__inner {
		@apply w-48;
	}
}
.deck-list-form.el-form-item {
	label {
		@apply flex flex-row justify-start text-white text-base;
	}
}
</style>
<style lang="scss" scoped>
.deck-list {
	min-height: calc(100vh - 104px);
	.search-bar {
		@apply w-full flex flex-row justify-center pt-5;
	}
}
</style>
