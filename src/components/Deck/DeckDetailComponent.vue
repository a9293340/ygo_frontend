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
    <img :src="`/api/card-image/cards/${item?.card_number}.webp`" alt="" />
  </div>
</template>

<style lang="scss" scoped>
.cards-item {
  @apply inline-block align-bottom;
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
  }
}
</style>
