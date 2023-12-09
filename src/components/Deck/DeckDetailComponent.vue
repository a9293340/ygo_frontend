<script setup lang="ts">
import type { Deck } from 'module-types';

interface DeckDetailItemProps {
  deck: Deck;
  showRarity: boolean;
  deckType: 'main_deck' | 'extra_deck' | 'side_deck';
}

const props = withDefaults(defineProps<DeckDetailItemProps>(), {
  showRarity: true,
});

const emit = defineEmits(['cardInfo']);

const openCardInfo = (i: number, type: 'main_deck' | 'extra_deck' | 'side_deck') => {
  emit('cardInfo', i, type);
};
</script>

<template>
  <div
    v-if="props.deck"
    class="cards-item"
    v-for="(item, i) in props.deck[props.deckType]"
    :key="item.card_id"
    @click="openCardInfo(i, props.deckType)"
  >
    <div class="item-desc" v-if="!props.showRarity">
      <el-tooltip effect="dark" :content="item.card_rarity" placement="top">
        <span>{{ item.card_num_id }}</span>
      </el-tooltip>
    </div>
    <div v-else>
      <div class="item-desc">
        <span>{{ item.card_num_id }}</span>
      </div>
      <div class="item-desc">
        <span>{{ item.card_rarity }}</span>
      </div>
    </div>
    <img :src="`/api/card-image/cards/${item?.card_number}.webp`" alt="" />
  </div>
</template>

<style scoped>
.cards-item {
  @apply inline-block align-top;
  padding: 5px;
  width: 10%;
  .item-desc {
    @apply text-xs text-white flex;
    span {
      @apply cursor-help;
    }
  }
  img {
    @apply cursor-pointer;
  }
}
</style>
