<script setup lang="ts">
// @ts-ignore
import type { CardsList, Cards } from "module-types";
import { useIntersection } from "../../composables/useIntersection";
import type { ComponentPublicInstance } from "vue";
import { extraType } from "../../config/ygo";
import {
	VueDraggable,
	type UseDraggableReturn,
	type SortableEvent,
} from "vue-draggable-plus";
import { auto } from "@popperjs/core";

interface DeckCardsListProps {
	cardsList: CardsList | [];
	trigger: number;
}

type DeckType = {
	card_id: string;
	card_rarity: string;
	card_number: string;
	card_num_id: string;
};

const emit = defineEmits(["call:api"]);
const drag = ref<UseDraggableReturn>();
const mainDeckLens = ref(60);
const pickIndex = ref(0);

const { intersectionObserver, isIntersection } = useIntersection();
const loadingRef = ref<ComponentPublicInstance<HTMLElement>>();
const props = withDefaults(defineProps<DeckCardsListProps>(), {
	cardsList: () => [],
	trigger: 0,
});
const cardsList = computed(() => props.cardsList);
const trigger = computed(() => props.trigger);
const cardsListRarity = computed(
	() => cardsList.value.map((item: Cards) => item.rarity[0]) as string[]
);
// Deck
const mainDeckOrigin = ref<CardsList>([]);
const mainDeck = ref<DeckType[]>([]);

const extraDeckOrigin = ref<CardsList>([]);
const extraDeck = ref<DeckType[]>([]);

const sideDeckOrigin = ref<CardsList>([]);
const sideDeck = ref<DeckType[]>([]);

watch(trigger, () => {
	const cardListElement = document.querySelector(".card-list") as HTMLElement;
	cardListElement.scrollTop = 0;
});

watch(isIntersection, (newVal) => {
	if (newVal) emit("call:api");
});

const removeDeck = (type: string, idx: number) => {
	switch (type) {
		case "m":
			mainDeck.value.splice(idx, 1);
			break;
		case "e":
			extraDeck.value.splice(idx, 1);
			break;
		case "s":
			sideDeck.value.splice(idx, 1);
			break;
	}
};

const deckEnd = (evt: SortableEvent) => {
	evt.item.style.height = "calc(45% - 2px)";
	const fromClass = evt.from.classList[0] as string;
	const toClass = evt.to.classList[0] as string;
	const targetCardIndex = evt.oldIndex as number;
	const targetCard =
		fromClass === "main-drag"
			? mainDeck.value[targetCardIndex]
			: fromClass === "extra-drag"
			  ? extraDeck.value[targetCardIndex]
			  : sideDeck.value[targetCardIndex];

	// 防自體增長
	if (fromClass === toClass) return;

	// 長度防呆
	if (
		toClass === "main-drag" &&
		mainDeckOrigin.value.length >= mainDeckLens.value
	)
		return;
	if (toClass === "side-drag" && sideDeckOrigin.value.length >= 15) return;
	if (toClass === "extra-drag" && extraDeckOrigin.value.length >= 15) return;

	// main to extra
	if (fromClass === "main-drag" && toClass === "extra-drag") {
		extraDeck.value.splice(evt.newIndex, 1);
		return;
	}

	// extra to main
	if (fromClass === "extra-drag" && toClass === "main-drag") {
		mainDeck.value.splice(evt.newIndex, 1);
		return;
	}

	// 其他

	switch (fromClass) {
		case "main-drag":
			mainDeck.value.splice(evt.oldIndex, 1);
			break;
		case "extra-drag":
			extraDeck.value.splice(evt.oldIndex, 1);
			break;
		case "side-drag":
			sideDeck.value.splice(evt.oldIndex, 1);
			break;
	}

	switch (toClass) {
		case "main-drag":
			mainDeck.value.splice(evt.newIndex, 0, targetCard);
			break;
		case "extra-drag":
			extraDeck.value.splice(evt.newIndex, 0, targetCard);
			break;
		case "side-drag":
			sideDeck.value.splice(evt.newIndex, 0, targetCard);
			break;
	}
};

const onEnd = (evt: SortableEvent) => {
	evt.item.style.width = "100%";
	evt.item.children[1].style.display = "flex";
	const toClass = evt.to.classList[0] as string;
	pickIndex.value = evt.item.dataset.idx as number;
	const cardItem = cardsList.value[pickIndex.value] as Cards;
	const cardDeckItem = {
		card_id: cardItem._id,
		card_number: cardItem.number,
		card_rarity: cardsListRarity.value[pickIndex.value],
		card_num_id: cardItem.id,
	} as DeckType;

	// 長度防呆
	if (
		toClass === "main-drag" &&
		mainDeckOrigin.value.length >= mainDeckLens.value
	)
		return;
	if (toClass === "side-drag" && sideDeckOrigin.value.length >= 15) return;
	if (toClass === "extra-drag" && extraDeckOrigin.value.length >= 15) return;

	// 數量防呆
	const allData: DeckType[] = [
		...mainDeck.value,
		...extraDeck.value,
		...sideDeck.value,
	];
	let count = 0;
	for (let i = 0; i < allData.length; i++) {
		const data = allData[i];
		if (data.card_id === cardDeckItem.card_id) count++;

		if (count >= 3) break;
	}

	if (count >= 3) return;

	// Extra 移動到 Main 防呆
	// const toClassIsExtra = toClass === "extra-drag";
	const isExtra = extraType.findIndex((item) => item === cardItem.type) !== -1;
	if (isExtra && toClass === "main-drag") {
		if (toClass === "main-drag") mainDeckOrigin.value.splice(evt.newIndex, 1);
		else sideDeckOrigin.value.splice(evt.newIndex, 1);

		if (extraDeck.value.length < 15) extraDeck.value.push(cardDeckItem);

		return;
	}

	// Main 移動到 Extra 防呆
	if (!isExtra && toClass === "extra-drag") {
		extraDeckOrigin.value.splice(evt.newIndex, 1);

		if (mainDeck.value.length < mainDeckLens.value)
			mainDeck.value.push(cardDeckItem);
		else if (sideDeck.value.length < 15) sideDeck.value.push(cardDeckItem);
	}

	// 其他
	switch (toClass) {
		case "main-drag":
			mainDeck.value.push(cardDeckItem);
			break;
		case "extra-drag":
			extraDeck.value.push(cardDeckItem);
			break;
		case "side-drag":
			sideDeck.value.push(cardDeckItem);
			break;
	}
};

const onDeckStart = (evt: SortableEvent) => {
	evt.dragged.style.height = "120px";
};

const onStart = (evt: SortableEvent) => {
	evt.dragged.style.width = "80px";
	evt.dragged.children[1].style.display = "none";
};

onMounted(() => {
	intersectionObserver(loadingRef.value?.$el);
});
</script>

<template>
	<div class="deck-win-component">
		<div class="card-list">
			<VueDraggable
				ref="drag"
				v-model="cardsList"
				:group="{ name: 'cards', pull: 'clone', put: false }"
				:animation="150"
				:sort="false"
				ghostClass="ghost"
				@end="onEnd"
				@move="onStart"
			>
				<div
					class="card-info-list"
					:data-idx="i"
					v-for="(item, i) in cardsList"
				>
					<el-tooltip effect="dark" placement="right-start">
						<template #content>
							<img
								:src="`/api/card-image/cards/${item?.number}.webp`"
								alt=""
								class="img"
							/>
						</template>
						<img :src="`/api/card-image/cards/${item?.number}.webp`" alt="" />
					</el-tooltip>
					<div class="card-info">
						<div class="name">{{ item.name }}</div>
						<div class="number">
							{{ item.id }}
						</div>
						<div class="star-att-type">
							{{ item.star }}{{ item.star && "/" }}{{ item.attribute
							}}{{ item.attribute && "/" }}{{ item.type }}
						</div>
						<div class="atk" v-if="item.atk && item.def">
							<span>ATK :{{ item.atk }}</span>
							<span>DEF :{{ item.atk }}</span>
						</div>
						<div class="rarity">
							<select v-model="cardsListRarity[i]">
								<option
									v-for="(rarity, index) in item.rarity"
									:value="rarity"
									:key="index"
								>
									{{ rarity }}
								</option>
							</select>
						</div>
						<!-- <div class="btn">
							<el-button type="primary">加入</el-button>
						</div> -->
					</div>
				</div>
			</VueDraggable>
			<Loading ref="loadingRef" />
		</div>
		<div class="deck-contents">
			<!-- main -->
			<div class="title">
				Main Deck({{ mainDeck.length }}/{{ mainDeckLens }})
			</div>
			<div class="main-deck">
				<VueDraggable
					ref="drag"
					v-model="mainDeckOrigin"
					:group="{ name: 'cards', pull: 'clone' }"
					:animation="150"
					ghostClass="ghost"
					class="main-drag"
					@end="deckEnd"
					@move="onDeckStart"
					data-type="m"
				>
					<div
						v-for="(item, i) in mainDeck"
						:key="item.card_id"
						class="main-drag-item text-white"
					>
						<div class="item-desc">
							<el-tooltip
								effect="dark"
								:content="item.card_num_id"
								placement="top"
							>
								<span>{{ item.card_rarity }}</span>
							</el-tooltip>
							<el-icon
								size="20"
								class="cursor-pointer"
								@click="removeDeck('m', i)"
							>
								<CloseBold />
							</el-icon>
						</div>
						<img
							:src="`/api/card-image/cards/${item?.card_number}.webp`"
							alt=""
						/>
					</div>
				</VueDraggable>
			</div>
			<!-- extra -->
			<div class="title">Extra Deck({{ extraDeck.length }}/15)</div>
			<div class="main-deck extra-deck">
				<VueDraggable
					ref="drag"
					v-model="extraDeckOrigin"
					:group="{ name: 'cards', pull: 'clone' }"
					:animation="150"
					ghostClass="ghost"
					class="extra-drag"
					@end="deckEnd"
					@move="onDeckStart"
					data-type="e"
				>
					<div
						v-for="(item, i) in extraDeck"
						:key="item.card_id"
						class="extra-drag-item text-white"
					>
						<div class="item-desc">
							<el-tooltip
								effect="dark"
								:content="item.card_num_id"
								placement="top"
							>
								<span>{{ item.card_rarity }}</span>
							</el-tooltip>
							<el-icon
								size="20"
								class="cursor-pointer"
								@click="removeDeck('e', i)"
							>
								<CloseBold />
							</el-icon>
						</div>
						<img
							:src="`/api/card-image/cards/${item?.card_number}.webp`"
							alt=""
						/>
					</div>
				</VueDraggable>
			</div>
			<!-- side -->
			<div class="title">Side Deck({{ sideDeck.length }}/15)</div>
			<div class="main-deck side-deck">
				<VueDraggable
					ref="drag"
					v-model="sideDeckOrigin"
					:group="{ name: 'cards', pull: 'clone' }"
					:animation="150"
					ghostClass="ghost"
					class="side-drag"
					@end="deckEnd"
					@move="onDeckStart"
					data-type="s"
				>
					<div
						v-for="(item, i) in sideDeck"
						:key="item.card_id"
						class="side-drag-item text-white"
					>
						<div class="item-desc">
							<el-tooltip
								effect="dark"
								:content="item.card_num_id"
								placement="top"
							>
								<span>{{ item.card_rarity }}</span>
							</el-tooltip>
							<el-icon
								size="20"
								class="cursor-pointer"
								@click="removeDeck('s', i)"
							>
								<CloseBold />
							</el-icon>
						</div>
						<img
							:src="`/api/card-image/cards/${item?.card_number}.webp`"
							alt=""
						/>
					</div>
				</VueDraggable>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.deck-win-component {
	@apply w-full h-full flex flex-row;
	.card-list {
		@apply w-1/4 h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-rounded-xl scrollbar-thumb-rounded-xl scrollbar-thumb-blue-700 scrollbar-track-slate-200 text-white;
		.card-info-list {
			@apply w-full flex flex-row mb-4 cursor-move;
			img {
				@apply h-36 w-auto;
			}
			img.img {
				@apply h-64 w-auto;
			}
			select {
				padding: 5px 8px;
				border-radius: 5px;
				width: 8vw;
				background-color: rgba(255, 255, 255, 0.9);
				color: black;
			}
			.card-info {
				@apply flex flex-col pl-3;
				width: calc(100% - 9rem);
				.name {
					@apply text-lg font-extrabold mb-1 overflow-hidden text-ellipsis whitespace-nowrap;
				}
				.number,
				.star-att-type {
					@apply text-base font-semibold mb-1;
				}
				.star-att-type {
					@apply mb-1;
				}
				.atk {
					@apply text-base flex justify-between flex-row;
				}
			}
		}
	}
	.deck-contents {
		@apply w-3/4 h-full pl-2 flex flex-col;
		.title {
			@apply text-white text-lg font-extrabold;
		}
		.main-deck {
			@apply w-full h-[calc(50%-20px)] border-white border rounded-lg;
			.main-drag,
			.extra-drag,
			.side-drag {
				@apply w-full h-full p-2 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-rounded-xl scrollbar-thumb-rounded-xl scrollbar-thumb-blue-700 scrollbar-track-slate-200;
				font-size: 0;
				.main-drag-item,
				.extra-drag-item,
				.side-drag-item {
					@apply w-auto mr-2 mb-2 inline-block  box-border text-center;
					height: calc(45% - 2px);
					.item-desc {
						@apply items-center text-base text-white flex flex-row justify-between;
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

		.extra-deck {
			@apply h-[calc(25%-20px)];
			.extra-drag {
				.extra-drag-item {
					height: calc(90% - 2px);
				}
			}
		}

		.side-deck {
			@apply h-[calc(25%-20px)];
			.side-drag {
				.side-drag-item {
					height: calc(90% - 2px);
				}
			}
		}
	}
}
</style>
