<script setup lang="ts">
import type { CardsList, forbiddenCardList } from 'module-types';
import type { forbiddenCardListType } from 'request-data-types';
import type { CardListType } from 'request-data-types';
import type { HasTotalRes } from 'response-data-types';
import DeckWin from '@/components/Deck/DeckWin.vue';
import type { NotHasTotalRes } from 'response-data-types';
import { decode } from '@/util';
import { callApi } from '@/util/api';

const cardsList = ref<[] | CardsList>([]);
const forbiddenCardList = ref<forbiddenCardList>([]);
const limit = ref(20);
const page = ref(0);
const trigger = ref(0);
const total = ref(0);

const getCardsList = async (cards: {
  cards: HasTotalRes<CardsList>;
  listQuery: CardListType;
}) => {
  if (!cards.listQuery.page) {
    cardsList.value = [];
    trigger.value++;
  }
  cardsList.value = [...cardsList.value, ...cards.cards.list];
  forbiddenCardList.value = decode<NotHasTotalRes<forbiddenCardList>>(
    (
      await callApi<forbiddenCardListType>(
        {},
        'forbiddenCardList',
        'list',
        false
      )
    ).data
  ).list;

  total.value = cards.cards.total;
  page.value = cards.listQuery.page;
};

const callApis = () => {
  page.value = page.value + 1;
};
</script>

<template>
  <div class="deck-add">
    <SearchCards
      @get:data="getCardsList"
      v-model:page="page"
      v-model:limit="limit"
    />
    <div class="main-win">
      <DeckWin
        :total="total"
        :cards-list.sync="cardsList"
        :forbidden-card-list="forbiddenCardList"
        @call:api="callApis"
        :trigger.sync="trigger"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.deck-add {
  min-height: calc(100vh - 104px);
}
</style>
