<template>
	<div class="search-cards">
		<div class="form-container" :class="{ 'close-form': !isShowForm }">
			<div v-if="!isShowForm" class="mask mobile">
				{{ $t("card.show_form") }}
			</div>
			<!-- 卡號 -->
			<div class="item-box">
				<div class="item-title">{{ $t("card.id") + "：" }}</div>
				<input
					v-model="listQuery.filter.id"
					type="text"
					:placeholder="$t('card.input_id')"
				/>
			</div>
			<!-- 卡片名稱 -->
			<div class="item-box">
				<div class="item-title">{{ $t("card.name") + "：" }}</div>
				<input
					v-model="listQuery.filter.name"
					type="text"
					:placeholder="$t('card.input_name')"
				/>
			</div>
			<!-- 卡片密碼 -->
			<div class="item-box">
				<div class="item-title">{{ $t("card.number") + "：" }}</div>
				<input
					v-model="listQuery.filter.number"
					type="text"
					@input="
						listQuery.filter.number = listQuery.filter.number?.replace(
							/[^\d]/g,
							''
						)
					"
					:placeholder="$t('card.input_number')"
				/>
			</div>
			<!-- 種類 -->
			<div class="item-box">
				<div class="item-title">{{ $t("card.type") + "：" }}</div>
				<select v-model="listQuery.filter.type">
					<option value=""></option>
					<option
						v-for="(item, index) in ygoOptions.type"
						:value="item"
						:key="index"
					>
						{{ item }}
					</option>
				</select>
			</div>
			<!-- 星數 -->
			<div class="item-box">
				<div class="item-title">{{ $t("card.star") + "：" }}</div>
				<select v-model="listQuery.filter.star">
					<option value=""></option>
					<option
						v-for="(item, index) in ygoOptions.star"
						:value="item"
						:key="index"
					>
						{{ item }}
					</option>
				</select>
			</div>
			<!-- 屬性 -->
			<div class="item-box">
				<div class="item-title">{{ $t("card.attribute") + "：" }}</div>
				<select v-model="listQuery.filter.attribute">
					<option value=""></option>
					<option
						v-for="(item, index) in ygoOptions.attribute"
						:value="item"
						:key="index"
					>
						{{ item }}
					</option>
				</select>
			</div>
			<!-- 種族 -->
			<div class="item-box">
				<div class="item-title">{{ $t("card.race") + "：" }}</div>
				<select v-model="listQuery.filter.race">
					<option value=""></option>
					<option
						v-for="(item, index) in ygoOptions.race"
						:value="item"
						:key="index"
					>
						{{ item }}
					</option>
				</select>
			</div>
			<!-- 稀有度 -->
			<div class="item-box">
				<div class="item-title">{{ $t("card.rarity") + "：" }}</div>
				<select v-model="listQuery.filter.rarity">
					<option value=""></option>
					<option
						v-for="(item, index) in ygoOptions.rare"
						:value="item"
						:key="index"
					>
						{{ item }}
					</option>
				</select>
			</div>
			<!-- 包裝分類 -->
			<div class="item-box">
				<div class="item-title">
					{{ $t("card.product_information_type") + "：" }}
				</div>
				<select v-model="listQuery.filter.product_information_type">
					<option value=""></option>
					<option
						v-for="(item, index) in packTypeList"
						:value="item.packType"
						:key="index"
					>
						{{ item.name }}
					</option>
				</select>
			</div>
			<!-- 攻擊力 -->
			<div class="item-box">
				<div class="item-title">{{ $t("card.atk") + "：" }}</div>
				<input
					v-model="listQuery.filter.atk_l"
					type="text"
					@input="
						listQuery.filter.atk_l =
							typeof listQuery.filter.atk_l === 'string'
								? listQuery.filter.atk_l.replace(/[^\d]/g, '')
								: listQuery.filter.atk_l
					"
				/>
				<span>~</span>
				<input
					v-model="listQuery.filter.atk_t"
					type="text"
					@input="
						listQuery.filter.atk_t =
							typeof listQuery.filter.atk_t === 'string'
								? listQuery.filter.atk_t.replace(/[^\d]/g, '')
								: listQuery.filter.atk_t
					"
				/>
			</div>
			<!-- 守備力 -->
			<div class="item-box">
				<div class="item-title">{{ $t("card.def") + "：" }}</div>
				<input
					v-model="listQuery.filter.def_l"
					type="text"
					@input="
						listQuery.filter.def_l =
							typeof listQuery.filter.def_l === 'string'
								? listQuery.filter.def_l.replace(/[^\d]/g, '')
								: listQuery.filter.def_l
					"
				/>
				<span>~</span>
				<input
					v-model="listQuery.filter.def_t"
					type="text"
					@input="
						listQuery.filter.def_t =
							typeof listQuery.filter.def_t === 'string'
								? listQuery.filter.def_t.replace(/[^\d]/g, '')
								: listQuery.filter.def_t
					"
				/>
			</div>
			<button
				class="search-btn"
				@click="getList({ page: 0, limit: listQuery.limit })"
			>
				{{ $t("card.search") }}
			</button>
		</div>
		<div class="toggle-btn mobile" @click="isShowForm = !isShowForm">
			<el-icon v-if="isShowForm"><CaretTop /></el-icon>
			<el-icon v-else><CaretBottom /></el-icon>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ygoOptions } from "@/config/ygo";
import type { CardListType, PackTypeListType } from "request-data-types";
import type { PaginationGetList } from "common-types";
import type { CardsList, PackTypeList } from "module-types";
import type { HasTotalRes } from "response-data-types";
import { decode, removeNullAndEmptyString } from "@/util";
import { callApi } from "@/util/api";

const emit = defineEmits(["get:data"]);

const props = defineProps({
	page: {
		type: Number,
		default: 0,
	},
	limit: {
		type: Number,
		default: 20,
	},
});

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
const isShowForm = ref<Boolean>(true);
const packTypeList = ref<PackTypeList | []>([]);
const page = computed(() => props.page);

watch(page, () => {
	getList({
		limit: props.limit,
		page: props.page,
	});
});

const getList = async (val: PaginationGetList) => {
	isShowForm.value = false;
	listQuery.value.page = val.page;
	await getCards();
};
const getCards = async () => {
	if (
		listQuery.value.filter.atk_l &&
		typeof listQuery.value.filter.atk_l === "string"
	) {
		listQuery.value.filter.atk_l = parseInt(listQuery.value.filter.atk_l);
	}
	if (
		listQuery.value.filter.atk_t &&
		typeof listQuery.value.filter.atk_t === "string"
	) {
		listQuery.value.filter.atk_t = parseInt(listQuery.value.filter.atk_t);
	}
	if (
		listQuery.value.filter.def_l &&
		typeof listQuery.value.filter.def_l === "string"
	) {
		listQuery.value.filter.def_l = parseInt(listQuery.value.filter.def_l);
	}
	if (
		listQuery.value.filter.def_t &&
		typeof listQuery.value.filter.def_t === "string"
	) {
		listQuery.value.filter.def_t = parseInt(listQuery.value.filter.def_t);
	}
	listQuery.value.page = props.page;
	listQuery.value.limit = props.limit;
	const cards = decode<HasTotalRes<CardsList>>(
		(
			await callApi<CardListType>(
				removeNullAndEmptyString(listQuery.value),
				"cards",
				"list",
				false
			)
		).data
	);
	// console.log(cards);
	emit("get:data", {
		cards,
		listQuery: listQuery.value,
	});
};

const getPackType = async () => {
	packTypeList.value = decode<HasTotalRes<PackTypeList>>(
		(
			await callApi<PackTypeListType>(
				{
					page: 0,
					limit: 0,
					filter: {
						status: 0,
					},
				},
				"packType",
				"list",
				false
			)
		).data
	).list.map((el) => ({
		name: el.name,
		packType: el.packType,
	}));

	localStorage.setItem(
		"ygo-pack",
		JSON.stringify({
			list: packTypeList.value,
			date: new Date(),
		})
	);
};

onMounted(async () => {
	if (!packTypeList.value.length) {
		const localPack = localStorage.getItem("ygo-pack");

		if (typeof localPack === "string") {
			const pack = JSON.parse(localPack) as {
				list: PackTypeList;
				date: string;
			};

			if (
				new Date().getTime() - new Date(pack.date).getTime() >=
				24 * 60 * 60 * 1000
			)
				await getPackType();
			else packTypeList.value = pack.list;
		} else await getPackType();
	}

	await getCards();
});
</script>

<style lang="scss" scoped>
.search-cards {
	& .form-container {
		@apply flex flex-wrap justify-center relative overflow-hidden;
		width: 1150px;
		margin: 0 auto;
		padding: 20px 0;
		border: 1px solid rgba(255, 255, 255, 0.2);
		& .mask {
			@apply w-full text-center;
			height: 30px;
			color: lightgray;
		}
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
				width: 150px;
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
	& .toggle-btn {
		@apply cursor-pointer text-center;
		color: lightgray;
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-top: transparent;
		width: 80px;
		margin: 0 auto 20px;
		padding: 2px 0;
		border-radius: 0 0 5px 5px;
		transition-duration: 0.2s;
		&:hover {
			@apply text-white;
			border: 1px solid rgba(255, 255, 255, 0.5);
		}
	}
}

@media (max-width: 1200px) {
	.search-cards {
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
	.search-cards {
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
	.search-cards {
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
