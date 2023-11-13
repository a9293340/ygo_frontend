<script setup lang="ts">
import type { CardsList } from "module-types";
import { useIntersection } from '../../composables/useIntersection';
import type { ComponentPublicInstance } from "vue";

interface DeckCardsListProps {
	cardsList: CardsList | [];
	trigger: number
}

const emit = defineEmits(['call:api'])

const {intersectionObserver,isIntersection} = useIntersection()
const loadingRef = ref<ComponentPublicInstance<HTMLElement>>()
const props = withDefaults(defineProps<DeckCardsListProps>(), {
	cardsList: () => [],
	trigger: 0
});
const cardsList = computed(() => props.cardsList);
const trigger = computed(() => props.trigger)

watch(trigger,() => {
	const cardListElement = document.querySelector('.card-list') as HTMLElement;
	cardListElement.scrollTop = 0
})

watch(isIntersection,(newVal) => {
	if(newVal)
		emit('call:api')
})

onMounted(() => {
	intersectionObserver(loadingRef.value?.$el)
})
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
			<Loading ref="loadingRef"/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.deck-win-component {
	@apply w-full h-full flex flex-row;
	.card-list {
		@apply w-1/4 h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-rounded-xl scrollbar-thumb-rounded-xl scrollbar-thumb-blue-700 scrollbar-track-slate-200 text-white;
		.card-info-list {
			@apply w-full flex flex-row mb-4;
			img {
				@apply h-36 w-auto;
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
					@apply mb-3;
				}
				.atk {
					@apply text-base flex justify-between flex-row;
				}
			}
		}
	}
}
</style>
