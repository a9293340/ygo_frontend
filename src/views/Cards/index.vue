<template>
	<div class="cards-wrapper" @click="chosenCard = ''">
		<SearchCards
			@get:data="getCards"
			v-model:page="listQuery.page"
			v-model:limit="listQuery.limit"
		/>
		<div class="list-container">
			<div class="card-info-box">
				<div class="card-info-title">
					<div>{{ $t("card.id") }}</div>
					<div class="lg-item">{{ $t("card.name") }}</div>
					<div>{{ $t("card.type") }}</div>
					<div class="sm-item">{{ $t("card.star") }}</div>
					<div class="sm-item">{{ $t("card.attribute") }}</div>
					<div class="sm-item">{{ $t("card.race") }}</div>
					<div class="lg-item">{{ $t("card.rarity") }}</div>
					<div class="sm-item">{{ $t("card.atk") }}</div>
					<div class="sm-item">{{ $t("card.def") }}</div>
					<div>{{ $t("card.number") }}</div>
					<div class="sm-item"></div>
				</div>
				<div
					class="card-info"
					:class="{ 'chosen-card': chosenCard === item.id }"
					v-for="item in list"
					:key="item.id"
					@click.stop="chosenCard = item.id ? item.id : ''"
				>
					<div>{{ item.id }}</div>
					<div class="lg-item">{{ item.name }}</div>
					<div>{{ item.type }}</div>
					<div class="sm-item">{{ item.star }}</div>
					<div class="sm-item">{{ item.attribute }}</div>
					<div class="sm-item">{{ item.race }}</div>
					<div class="lg-item">
						<span
							v-for="(rarity, rarityIndex) in item.rarity"
							:key="rarityIndex"
						>
							{{
								`${rarity}${
									item.rarity.length - 1 === rarityIndex ? "" : "、"
								} `
							}}
						</span>
					</div>
					<div class="sm-item">{{ item.atk }}</div>
					<div class="sm-item">{{ item.def }}</div>
					<div>{{ item.number }}</div>
					<router-link class="detail sm-item" :to="`/cards/${item.id}`">{{
						$t("card.detail")
					}}</router-link>
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
</template>

<script setup lang="ts">
import type { CardListType } from "request-data-types";
import type { CardsList } from "module-types";
import type { PaginationGetList } from "common-types";
import type { HasTotalRes } from "response-data-types";
import { onMounted } from "vue";
import { removeNullAndEmptyString } from "@/util";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const list = ref<[] | CardsList>([]);
const total = ref(0);
const listQuery = ref<CardListType>({
	page: 0,
	limit: 20,
	filter: {
		id: "",
		number: "",
		name: "",
		type: "",
		star: "",
		race: "",
		attribute: "",
		rarity: "",
		atk_t: "",
		atk_l: "",
		def_t: "",
		def_l: "",
		product_information_type: "",
	},
});

const getList = async (val: PaginationGetList) => {
	listQuery.value.page = val.page;
};

const getCards = async (data: {
	cards: HasTotalRes<CardsList>;
	listQuery: CardListType;
}) => {
	list.value = data.cards.list;
	total.value = data.cards.total;
	listQuery.value.filter = data.listQuery.filter;
	await router.replace({
		query: removeNullAndEmptyString(listQuery.value.filter),
	});
};

const chosenCard = ref<string>("");

onMounted(async () => {
	listQuery.value.filter = { ...listQuery.value.filter, ...route.query };
});
</script>

<style lang="scss" scoped>
.cards-wrapper {
	min-height: calc(100vh - 104px);
	padding: 0 0 30px;

	& .list-container {
		width: 80vw;
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
