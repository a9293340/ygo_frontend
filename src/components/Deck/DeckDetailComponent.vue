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

@media (max-width: 1200px) {
  .deck-detail {
    #deck-list {
      width: 900px;
      .main-deck,
      .extra-deck,
      .side-deck {
        padding: 5px;
        .cards-item {
          padding: 3px;
        }
      }
    }
  }
}

@media (max-width: 900px) {
  .deck-detail {
    #deck-list {
      width: 760px;
      .main-deck,
      .extra-deck,
      .side-deck {
        min-height: 161.7px;
        padding: 5px;
        .cards-item {
          padding: 3px;
          width: 12.5%;
        }
      }
    }
  }
}
@media (max-width: 768px) {
  .deck-detail {
    min-height: calc(100vh - 101px);
    .btn-box {
      margin: 25px auto 0;
    }
    #deck-list {
      @apply w-full;
      .title {
        @apply text-base;
      }
      .copyright {
        font-size: 12px;
        padding: 0 5px;
      }
      .main-deck,
      .extra-deck,
      .side-deck {
        min-height: 32vw;
        .cards-item {
          padding: 2px;
          width: 20%;
          .item-desc {
            font-size: 10px;
          }
        }
      }
    }
  }
</style>
