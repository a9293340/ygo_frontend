<script setup lang="ts">
import i18n from "@/i18n/index";
import type { DeckList, Deck } from "module-types";
import type { DeckListType } from "request-data-types";
import type { HasTotalRes } from "response-data-types";
import { callApi } from "@/util/api";
import { decode } from "@/util";
import ExcelJS from "exceljs";
import { toPng } from "html-to-image";

const { t } = i18n.global;

const deck = ref<Deck>();

const route = useRoute();
const imgUrl = ref("");
const dialogVisible = ref(false);

const getDataFromDeck = () => {
	const makeDeckArr = (decks: DeckContent[]) => {
		let arr = [];
		for (let i = 0; i < decks.length; i++) {
			const deck = decks[i];
			arr.push([
				deck.card_name,
				deck.card_num_id,
				deck.card_number,
				deck.card_rarity,
				new Date(deck.card_price[0].time).toDateString(),
				deck.card_price[0].price_avg,
				deck.card_price[0].price_lowest,
			]);
		}
		return arr;
	};
	const deckArr = [
		"卡名",
		"卡號",
		"卡片密碼",
		"稀有度",
		"價格取得時間",
		"價格(均價)",
		"價格(最低)",
	];
	let data = [];
	// title
	data.push([`牌組名稱 :`, deck.value.title]);
	// create_date
	data.push([`${t("deck.deck_time_create")} :`, deck.value.create_date]);

	data.push([]);
	data.push([]);
	data.push([]);

	// main_deck
	if (deck.value.main_deck.length) {
		data.push([`${t("deck.main_deck")} :`]);
		data.push(deckArr);
		data.push(...makeDeckArr(deck.value.main_deck));
	}

	// extra_deck
	if (deck.value.extra_deck.length) {
		data.push([`${t("deck.extra_deck")} :`]);
		data.push(deckArr);
		data.push(...makeDeckArr(deck.value.extra_deck));
	}

	// side
	if (deck.value.side_deck.length) {
		data.push([`${t("deck.side_deck")} :`]);
		data.push(deckArr);
		data.push(...makeDeckArr(deck.value.side_deck));
	}
	data.push([]);
	data.push([]);
	data.push(["YGO Card Time", "YGO 卡壇", "https://ygo-cardtime.orp"]);

	return data;
};

const loadToExcel = async () => {
	try {
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("Sheet 1");

		const data = getDataFromDeck();

		worksheet.addRows(data);

		// 樣式
		const font1 = { name: "Arial", size: 16, bold: true };
		const font2 = { name: "Arial", size: 16, bold: true };
		let idx = 1;
		worksheet.getRow(idx++).font = font1;
		worksheet.getRow(idx++).font = font1;
		idx += 3;
		// main
		if (deck.value.main_deck.length) {
			worksheet.getRow(idx++).font = font2;
			worksheet.getRow(idx++).font = font2;
			for (let i = 0; i < deck.value.main_deck.length; i++) {
				idx++;
			}
		}
		// extra
		if (deck.value.extra_deck.length) {
			worksheet.getRow(idx++).font = font2;
			worksheet.getRow(idx++).font = font2;
			for (let i = 0; i < deck.value.extra_deck.length; i++) {
				idx++;
			}
		}
		// side
		if (deck.value.side_deck.length) {
			worksheet.getRow(idx++).font = font2;
			worksheet.getRow(idx++).font = font2;
			for (let i = 0; i < deck.value.side_deck.length; i++) {
				idx++;
			}
		}

		// 寬度
		worksheet.columns.forEach((column, index) => {
			let maxLength = 0;
			column.eachCell({ includeEmpty: true }, (cell) => {
				const columnLength = cell.value ? cell.value.toString().length : 0;
				if (columnLength > maxLength) {
					maxLength = columnLength;
				}
			});
			column.width = maxLength * 2 + 5;
		});

		// 行高
		worksheet.eachRow({ includeEmpty: true }, (row) => {
			row.height = 20;
		});

		const blob = await workbook.xlsx.writeBuffer();
		const blobUrl = URL.createObjectURL(new Blob([blob]));

		const link = document.createElement("a");
		link.href = blobUrl;
		link.download = "output.xlsx";
		link.click();

		URL.revokeObjectURL(blobUrl);
	} catch (error) {
		console.error("Error:", error);
	}
};

const getImage = () => {
	toPng(document.getElementById("deck-list"))
		.then(function (dataUrl) {
			imgUrl.value = dataUrl;
			dialogVisible.value = true;
		})
		.catch(function (error) {
			console.error("oops, something went wrong!", error);
		});
};

onMounted(async () => {
	deck.value = decode<HasTotalRes<DeckList>>(
		(
			await callApi<DeckListType>(
				{ page: 0, limit: 1, filter: { _id: route.params.id as string } },
				"deck",
				"deckList",
				false
			)
		).data
	).list[0];

	console.log(deck.value);
});
</script>

<template>
	<div class="deck-detail">
		<div class="tool-list">
			<el-button type="primary" class="mr-3" @click="getImage"
				>下載圖檔</el-button
			>
			<el-button type="primary" @click="loadToExcel">下載EXCEL</el-button>
		</div>
		<div id="deck-list">
			<div class="title">
				{{ t("deck.main_deck") }}({{ deck?.main_deck.length }})
			</div>
			<div class="main-deck">
				<div
					class="cards-item"
					v-for="(item, i) in deck?.main_deck"
					:key="item.card_id"
				>
					<div class="item-desc">
						<el-tooltip
							effect="dark"
							:content="item.card_rarity"
							placement="top"
						>
							<span>{{ item.card_num_id }}</span>
						</el-tooltip>
					</div>
					<img
						:src="`/api/card-image/cards/${item?.card_number}.webp`"
						alt=""
					/>
				</div>
			</div>
			<div class="title">
				{{ t("deck.extra_deck") }}({{ deck?.extra_deck.length }})
			</div>
			<div class="extra-deck">
				<div
					class="cards-item"
					v-for="(item, i) in deck?.extra_deck"
					:key="item.card_id"
				>
					<div class="item-desc">
						<el-tooltip
							effect="dark"
							:content="item.card_rarity"
							placement="top"
						>
							<span>{{ item.card_num_id }}</span>
						</el-tooltip>
					</div>
					<img
						:src="`/api/card-image/cards/${item?.card_number}.webp`"
						alt=""
					/>
				</div>
			</div>
			<div class="title">
				{{ t("deck.side_deck") }}({{ deck?.side_deck.length }})
			</div>
			<div class="extra-deck">
				<div
					class="cards-item"
					v-for="(item, i) in deck?.side_deck"
					:key="item.card_id"
				>
					<div class="item-desc">
						<el-tooltip
							effect="dark"
							:content="item.card_rarity"
							placement="top"
						>
							<span>{{ item.card_num_id }}</span>
						</el-tooltip>
					</div>
					<img
						:src="`/api/card-image/cards/${item?.card_number}.webp`"
						alt=""
					/>
				</div>
			</div>
		</div>
	</div>

	<el-dialog width="60vw" title="請對圖片點選右鍵下載" v-model="dialogVisible">
		<div class="dialog">
			<img :src="imgUrl" alt="" />
		</div>
	</el-dialog>
</template>

<style lang="scss" scoped>
.deck-detail {
	@apply flex flex-col items-center w-full;
	min-height: calc(100vh - 104px);
	.tool-list {
		@apply flex flex-row justify-center mt-6 mb-6;
	}
	#deck-list {
		@apply flex flex-col bg-black;
		width: 70vw;
		max-width: 1000px;
		.title {
			@apply text-white text-lg font-extrabold;
		}
		.main-deck,
		.extra-deck,
		.side-deck {
			@apply p-3 rounded-2xl mb-3;
			width: 100%;
			height: auto;
			border: 1px solid white;
			.cards-item {
				@apply inline-block  box-border text-center align-top mr-2 mb-2;
				width: 9%;
				height: auto;

				.item-desc {
					@apply items-center text-xs text-white flex flex-row justify-between;
					span {
						@apply cursor-help;
					}
				}
				img {
					@apply w-auto cursor-move;
					height: calc(100% - 23px);
				}
			}
		}
	}
}
.dialog {
	@apply w-full h-auto flex flex-row justify-center;
	img {
		@apply w-2/3 h-auto;
	}
}
</style>
