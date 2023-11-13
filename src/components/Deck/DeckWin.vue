<script setup lang="ts">
import type { CardsList } from "module-types";

interface DeckCardsListProps {
	cardsList: CardsList | [];
}

const props = withDefaults(defineProps<DeckCardsListProps>(), {
	cardsList: () => [],
});
const cardsList = computed(() => props.cardsList);
</script>

<template>
	<div class="deck-win-component">
		<div class="card-list">
			<div class="card-info-list" v-for="item in cardsList">
				<img :src="`/api/card-image/cards/${item?.number}.webp`" alt="" />
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
					<div class="btn">
						<el-button type="primary">加入</el-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.deck-win-component {
	@apply w-full h-full flex flex-row;
	.card-list {
		@apply w-1/4 h-full overflow-y-auto scrollbar-thin scrollbar-track-rounded-xl scrollbar-thumb-rounded-xl scrollbar-thumb-blue-700 scrollbar-track-slate-200 text-white;
		.card-info-list {
			@apply w-full flex flex-row mb-4;
			img {
				@apply w-36;
			}
			.card-info {
				@apply flex flex-col p-2;
				width: calc(100% - 9rem);
				.name {
					@apply text-2xl font-extrabold mb-2;
				}
				.number,
				.star-att-type {
					@apply text-lg font-semibold mb-3;
				}
				.star-att-type {
					@apply mb-10;
				}
				.atk {
					@apply text-lg flex justify-between flex-row;
				}
			}
		}
	}
}
</style>
