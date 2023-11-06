<template>
	<div class="cards-detail">
    <div class="card-container">
      <div class="left-box">
        <div class="name">{{ cardInfo?.name }}</div>
        <div class="effect">{{ cardInfo?.effect }}</div>
        <div class="info-box">
          <div class="info-title">
            <div>{{ $t("card.id") }}</div>
            <div>{{ $t("card.type") }}</div>
            <div>{{ $t("card.attribute") }}</div>
          </div>
          <div class="info-content">
            <div>{{ cardInfo?.id }}</div>
            <div>{{ cardInfo?.type }}</div>
            <div>{{ cardInfo?.attribute }}</div>
          </div>
          <div class="info-title">
            <div>{{ $t("card.star") }}</div>
            <div>{{ $t("card.atk") }}</div>
            <div>{{ $t("card.def") }}</div>
          </div>
          <div class="info-content">
            <div>{{ cardInfo?.star ? cardInfo.star : '-' }}</div>
            <div>{{ cardInfo?.atk ? cardInfo.atk : '-' }}</div>
            <div>{{ cardInfo?.def ? cardInfo.def : '-' }}</div>
          </div>
          <div class="info-title">
            <div>{{ $t("card.race") }}</div>
            <div>{{ $t("card.rarity") }}</div>
            <div>{{ $t("card.number") }}</div>
          </div>
          <div class="info-content">
            <div>{{ cardInfo?.race ? cardInfo.race : '-' }}</div>
            <div>
              <span v-for="(item, index) in cardInfo?.rarity" :key="index">
                {{ `${item}${cardInfo.rarity.length - 1 === index ? "" : "、"} ` }}
              </span>
            </div>
            <div>{{ cardInfo?.number }}</div>
          </div>
        </div>
      </div>
      <div class="right-box">
        <img v-if="cardInfo" :src="`/api/card-image/cards/${cardInfo?.number}.webp`" alt="">
      </div>
    </div>
    <PriceChart
        v-if="cardInfo && Array.isArray(cardInfo?.price_info)"
        :price="cardInfo?.price_info"
    />
	</div>
</template>


<script setup lang="ts">
import type { CardListType } from "request-data-types";
import type { Cards, CardsList } from "module-types";
import type { HasTotalRes } from "response-data-types";
import { callApi } from "@/util/api";
import { decode } from "@/util";
import "chartjs-adapter-date-fns";

const route = useRoute();
const cardInfo = ref<Cards | undefined>();

onMounted(async () => {
  cardInfo.value = decode<HasTotalRes<CardsList>>(
      (
          await callApi<CardListType>(
              { page: 0, limit: 1, filter: { id: route.params.id as string } },
              "cards",
              "list",
              false
          )
      ).data
  ).list[0];
  console.log(cardInfo.value);
});
</script>

<style lang="scss" scoped>
.cards-detail {
  min-height: calc(100vh - 104px);
  padding: 50px 0;
  & .card-container {
    @apply flex justify-between;
    width: 1200px;
    margin: 0 auto 50px;
    color: #333333;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 30px;
    border-radius: 10px;
    & .left-box {
      width: 800px;
      & .name {
        @apply font-bold;
        font-size: 24px;
        padding: 0 0 0 10px;
      }
      & .effect {
        @apply whitespace-pre-wrap text-justify;
        font-size: 18px;
        padding: 10px;
        margin: 10px 0 20px;
      }
      & .info-box {
        @apply w-full;
        font-size: 18px;
        & .info-title {
          @apply w-full flex;
          & div {
            @apply w-1/3 text-center text-white;
            border: 1px solid lightgray;
            background-color: #1f2c5d;
            padding: 5px 0;
          }
        }
        & .info-content {
          @apply w-full flex;
          margin: 0 0 10px 0;
          & div {
            @apply w-1/3 text-center;
            border: 1px solid lightgray;
            padding: 5px 0;
          }
        }
      }
    }
    & .right-box {
    }
  }
}

@media (max-width: 768px) {
  .cards-detail {
    min-height: calc(100vh - 101px);
  }
}
</style>
