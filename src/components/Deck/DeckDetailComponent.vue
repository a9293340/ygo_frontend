<script setup lang="ts">
import type { Deck } from 'module-types';

interface DeckDetailItemProps {
  deck: Deck;
  showRarity: boolean;
  deckType: 'main_deck' | 'extra_deck' | 'side_deck';
  showMoney: boolean;
}

const props = withDefaults(defineProps<DeckDetailItemProps>(), {
  showRarity: true,
});

const emit = defineEmits(['cardInfo']);
const deck = computed(() => props.deck);
const prices = ref([]);

watch(deck, () => {
  if (deck.value) prices.value = deck.value[props.deckType].map(() => '自開');
});

const openCardInfo = (i: number, type: 'main_deck' | 'extra_deck' | 'side_deck') => {
  emit('cardInfo', i, type);
};

const checkPrice = (i: number) => {
  if (prices.value[i].length > 5 && parseInt(prices.value[i])) {
    prices.value[i] = prices.value[i].substring(0, 5);
  } else if (prices.value[i].length > 3 && !parseInt(prices.value[i])) {
    prices.value[i] = prices.value[i].substring(0, 3);
  }
};
</script>

<template>
  <div
    v-if="props.deck"
    class="cards-item"
    v-for="(item, i) in props.deck[props.deckType]"
    :key="item.card_id"
  >
    <template v-if="props.showRarity">
      <div class="item-desc">
        <el-tooltip effect="dark" :content="item.card_rarity" placement="top">
          <span>{{ item.card_num_id }}</span>
        </el-tooltip>
      </div>
    </template>
    <template v-else>
      <div class="item-desc">
        <span>{{ item.card_num_id }}</span>
      </div>
      <div class="item-desc">
        <span>{{ item.card_rarity }}</span>
      </div>
    </template>
    <img
      @click="openCardInfo(i, props.deckType)"
      :src="`/api/card-image/cards/${item?.card_number}.webp`"
      alt=""
    />
    <template v-if="props.showMoney">
      <div class="item-desc item-money">
        <div class="money-format">
          <div class="text-blue-400">$</div>
          <input type="text" v-model="prices[i]" @input="checkPrice(i)" />
        </div>
      </div>
    </template>
  </div>
</template>

<style>
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
</style>

<style lang="scss" scoped>
.cards-item {
  @apply inline-block align-bottom;
  padding: 5px;
  width: 10%;
  .item-desc {
    @apply text-xs text-white flex justify-between items-center;
  }
  .item-money {
    @apply w-full;
    .money-format {
      @apply flex flex-row items-center justify-between w-full text-base;
      input {
        @apply text-blue-400 h-5 p-0 bg-black border-black;
        width: 85%;
      }
    }
  }
  img {
    @apply cursor-pointer;
  }
}

@media (max-width: 1200px) {
  .cards-item {
    padding: 3px;
  }
}

@media (max-width: 900px) {
  .cards-item {
    padding: 3px;
    width: 12.5%;
  }
}
@media (max-width: 768px) {
  .cards-item {
    padding: 2px;
    width: 20%;
    .item-desc {
      font-size: 9.5px;
    }
    .item-money {
      .money-format {
        input {
          height: 24px;
        }
      }
    }
  }
}
</style>
