<script setup lang="ts">
import type { HasTotalRes } from "response-data-types";
import type { DeckListType, DeckDeleteType } from "request-data-types";
import type { PaginationGetList } from "common-types";
import type { DeckList } from "module-types";
import { decode, removeNullAndEmptyString } from "@/util";
import { callApi } from "@/util/api";
import i18n from "@/i18n/index";
import { useRoute, useRouter } from "vue-router";
import { useDeckStore } from "@/stores/deck";

const { t } = i18n.global;
const route = useRoute();
const router = useRouter();
const { pick_deck_id } = storeToRefs(useDeckStore());

const deckList = ref<DeckList>([]);
const chosenCard = ref("");
const total = ref(0);
const date = ref("");
const removeVisible = ref(false);
const editVisible = ref(false);
const dialogTitle = ref("");
const dialogVisible = ref(false);
const nowPickTarget = ref(0);
const deck_check_id = ref("");

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

const getList = async (val: PaginationGetList) => {
	if (date.value !== "") {
		listQuery.value.filter.begin_date = new Date(date.value[0]).toDateString();
		listQuery.value.filter.end_date = new Date(date.value[1]).toDateString();
	}
	listQuery.value.page = val.page;
	console.log(listQuery.value);

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
	await router.replace({
		query: removeNullAndEmptyString(listQuery.value.filter),
	});
	console.log(deckList.value);
};

watch(dialogVisible, (newVal) => {
	if (!newVal) {
		removeVisible.value = false;
		editVisible.value = false;
	}
});

const removeDeck = async () => {
	const target_id = deckList.value.find(
		(el) => el.admin_id === deck_check_id.value
	);
	if (target_id) {
		try {
			const data = await callApi<DeckDeleteType>(
				{ _id: target_id._id },
				"deck",
				"delete",
				false
			);
		} catch (error) {}

		await getList({ limit: listQuery.value.limit, page: 0 });
		dialogVisible.value = false;
	}
};

const editDeck = () => {
	const target_id = deckList.value.find(
		(el) => el.admin_id === deck_check_id.value
	);
	if (target_id) {
		pick_deck_id.value = target_id.admin_id;
		router.push("/deck/add");
	}
};

const openDialog = (type: string, idx: number) => {
	if (type === "r") {
		removeVisible.value = true;
		dialogTitle.value = t("deck.remove");
	} else {
		editVisible.value = true;
		dialogTitle.value = t("deck.edit");
	}
	nowPickTarget.value = idx;
	dialogVisible.value = true;
};

onMounted(async () => {
	listQuery.value.filter = { ...listQuery.value.filter, ...route.query };
	await getList({ limit: listQuery.value.limit, page: 0 });
});
</script>

<template>
	<div class="deck-list">
		<div class="search-bar">
			<div class="list">
				<div class="title">{{ t("deck.deck_title") }}</div>
				<el-input class="deck-input" v-model="listQuery.filter.title" />
			</div>
			<div class="list date">
				<div class="title">{{ t("deck.deck_time") }}</div>
				<el-date-picker
					v-model="date"
					type="daterange"
					range-separator="To"
					:start-placeholder="t('deck.time_start')"
					:end-placeholder="t('deck.time_end')"
					class="date-picker"
				/>
			</div>
			<div class="list">
				<div class="title">{{ t("deck.deck_id") }}</div>
				<el-input class="deck-input" v-model="listQuery.filter.admin_id" />
			</div>
			<el-button
				type="primary"
				@click="getList({ limit: listQuery.limit, page: 0 })"
				>{{ t("card.search") }}</el-button
			>
		</div>
		<div class="list-container">
			<div class="card-info-box">
				<div class="card-info-title">
					<div class="lg-item">{{ t("deck.deck_name") }}</div>
					<div class="lg-item">{{ t("deck.deck_time_create") }}</div>
					<div class="lg-item">{{ t("deck.deck_time_edit") }}</div>
					<div class="sm-item"></div>
					<div class="sm-item"></div>
					<div class="sm-item"></div>
				</div>
				<div
					class="card-info"
					:class="{ 'chosen-card': chosenCard === item.title }"
					v-for="(item, i) in deckList"
					:key="item.title"
					@click.stop="chosenCard = item.title ? item.title : ''"
				>
					<div class="lg-item">{{ item.title }}</div>
					<div class="lg-item">{{ item.create_date.split(" ")[0] }}</div>
					<div class="lg-item">{{ item.last_edit_date.split(" ")[0] }}</div>
					<div class="sm-item">
						<el-button type="warning" @click="openDialog('e', i)">{{
							t("deck.edit")
						}}</el-button>
					</div>
					<div class="sm-item">
						<el-button type="danger" @click="openDialog('r', i)">{{
							t("deck.remove")
						}}</el-button>
					</div>
					<div class="sm-item">
						<el-button type="primary">{{ t("deck.detail") }}</el-button>
					</div>
				</div>
			</div>
		</div>

		<Pagination
			:hidden="total <= 0"
			:total="total"
			:limit="listQuery.limit"
			:page.sync="listQuery.page"
			@pagination="getList"
		/>
	</div>
	<!-- remove dialog -->
	<el-dialog v-model="dialogVisible" :title="dialogTitle">
		<el-form-item class="deck-form" :label="t('deck.deck_check')">
			<el-input class="deck-input" v-model="deck_check_id" />
		</el-form-item>
		<el-button
			style="width: 100px"
			type="danger"
			v-if="removeVisible"
			@click="removeDeck"
			>{{ t("deck.remove") }}</el-button
		>
		<el-button
			style="width: 100px"
			type="warning"
			v-if="editVisible"
			@click="editDeck"
			>{{ t("deck.edit") }}</el-button
		>
	</el-dialog>
</template>
<style lang="scss">
.deck-input.el-input {
	.el-input__wrapper {
		background-color: rgba(255, 255, 255, 0.9);
		overflow: hidden;
	}
	.el-input__inner {
		height: 35px;
		border-color: transparent;
		box-shadow: none;
	}
	.el-input {
		background-color: rgba(255, 255, 255, 0.6);
		border-radius: 5px;
	}
	.el-select-dropdown__item {
		background-color: rgba(255, 255, 255, 0.9);
	}
	.el-input__placeholder {
		@apply text-black;
	}
}
.deck-list-form.el-form-item {
	label {
		@apply flex flex-row justify-start text-white text-base mb-0 pb-0;
	}
}
</style>
<style lang="scss" scoped>
.deck-list {
	@apply flex flex-col items-center w-full;
	min-height: calc(100vh - 104px);
	.search-bar {
		@apply w-full flex flex-row justify-center  pt-5;
		.list {
			@apply flex flex-row items-center mr-8;
			touch-action: none;
		}
		.title {
			@apply text-white text-base mr-3 whitespace-nowrap;
		}
	}
	& .list-container {
		width: 60vw;
		min-width: 1150px;
		margin: 30px auto;
		& .card-info-box {
			@apply w-full flex flex-col;
			& .card-info-title,
			& .card-info {
				@apply flex w-full;
				color: lightgray;
				font-size: 16px;
				background-color: rgba(31, 44, 93, 0.6);
				& div {
					@apply flex flex-wrap justify-center items-center text-center;
					border: 1px solid lightgray;
					width: 130px;
					padding: 10px 0;
				}
				& .sm-item {
					width: 80px;
				}
				& .lg-item {
					@apply grow;
				}
				& .detail {
					@apply flex justify-center items-center text-center;
					border: 1px solid lightgray;
					padding: 10px 0;
					transition-duration: 0.2s;
					background-color: #181818;
					&:hover {
						@apply text-white;
						background-color: #333333;
					}
				}
			}
			& .card-info-title {
				background-color: #333333;
			}
			& .card-info {
				@apply cursor-pointer;
				transition-duration: 0.2s;
				&:hover {
					background-color: rgba(31, 44, 93, 0.3);
				}
			}
			& .chosen-card {
				background-color: rgba(31, 44, 93, 0.3);
			}
		}
	}
}

@media (max-width: 1200px) {
	.cards-wrapper {
		& .form-container {
			width: 900px;
		}
		& .list-container {
			width: 95vw;
			min-width: unset;
			overflow-y: scroll;
			& .card-info-box {
				min-width: 1100px;
			}
		}
	}
}

@media (max-width: 900px) {
	.cards-wrapper {
		& .form-container {
			width: 760px;
			& .item-box {
				& input,
				& select {
					width: 140px;
				}
			}
		}
	}
}

@media (max-width: 768px) {
	.cards-wrapper {
		min-height: calc(100vh - 101px);
		& .close-form {
			height: 55px;
		}
		& .form-container {
			@apply w-full;
			& .item-box {
				font-size: 16px;
				margin: 0 5px 10px;
				& .item-title {
					color: lightgray;
					margin: 0 0 3px;
				}
				& input,
				& select {
					padding: 5px 8px;
					border-radius: 5px;
					width: 45vw;
					background-color: rgba(255, 255, 255, 0.9);
				}
				& span {
					color: lightgray;
					margin: 0 0.25px;
				}
			}
			& .search-btn {
				@apply self-end;
				color: lightgray;
				border: 1px solid lightgray;
				padding: 5px 8px;
				border-radius: 5px;
				width: 150px;
				height: 36px;
				margin: 10px 5px 10px;
				transition-duration: 0.2s;
				&:hover {
					@apply text-white;
					border: 1px solid white;
				}
			}
		}
	}
}
</style>
