<template>
  <div class="cards-detail">
    <div class="card-container">
      <div class="left-box">
        <div class="name">{{ cardInfo?.name }}</div>
        <div class="effect">{{ cardInfo?.effect }}</div>
        <div class="info-box">
          <div class="info-title">
            <div>{{ t('card.id') }}</div>
            <div>{{ t('card.type') }}</div>
            <div>{{ t('card.attribute') }}</div>
          </div>
          <div class="info-content">
            <div>{{ cardInfo?.id }}</div>
            <div>{{ cardInfo?.type }}</div>
            <div>{{ cardInfo?.attribute }}</div>
          </div>
          <div class="info-title">
            <div>{{ t('card.star') }}</div>
            <div>{{ t('card.atk') }}</div>
            <div>{{ t('card.def') }}</div>
          </div>
          <div class="info-content">
            <div>{{ cardInfo?.star ? cardInfo.star : '-' }}</div>
            <div>{{ cardInfo?.atk >= 0 ? cardInfo.atk : '-' }}</div>
            <div>{{ cardInfo?.def >= 0 ? cardInfo.def : '-' }}</div>
          </div>
          <div class="info-title">
            <div>{{ t('card.race') }}</div>
            <div>{{ t('card.rarity') }}</div>
            <div>{{ t('card.number') }}</div>
          </div>
          <div class="info-content">
            <div>{{ cardInfo?.race ? cardInfo.race : '-' }}</div>
            <div v-if="cardInfo">
              <span v-for="(item, index) in cardInfo?.rarity" :key="index">
                {{
                  `${item}${cardInfo?.rarity.length - 1 === index ? '' : '、'} `
                }}
              </span>
            </div>
            <div>{{ cardInfo?.number.substring(0, 8) }}</div>
          </div>
        </div>
      </div>
      <div class="right-box">
        <img
          v-if="cardInfo"
          :src="`/api/card-image/cards/${cardInfo?.number}.webp`"
          alt=""
        />
      </div>
    </div>
    <div class="chart-box">
      <div class="select-box" v-if="account_id && account_token">
        <p>露天價格 :</p>
        <el-select v-model="priceType">
          <el-option value="avg" label="露天均價" />
          <el-option value="lowest" label="露天最低價" />
        </el-select>
      </div>
      <PriceChart
        v-if="cardInfo && Array.isArray(cardInfo?.price_info)"
        :type="priceType"
        :price="cardInfo?.price_info"
        :colors="colors"
        :y-axis-set-size="5"
        :x-axis-set-size="4"
        width="100%"
        height="400px"
        :x-grid="true"
        x-grid-color="rgba(255,255,255,0.3)"
        :y-grid="true"
        y-grid-color="rgba(255,255,255,0.3)"
        :x-tick-set="{
          color: 'white',
          size: 14,
          weight: '700',
        }"
        :y-tick-set="{
          color: 'white',
          size: 14,
          weight: '700',
        }"
        :legend="{
          color: 'white',
          size: 16,
          position: 'top',
        }"
        :tool-tip="{
          color: 'rgb(0,0,0)',
          titleSize: 16,
          contentSize: 14,
          bgc: 'rgba(255,255,255,0.7)',
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CardListType } from 'request-data-types';
import type { Cards, CardsList } from 'module-types';
import type { HasTotalRes } from 'response-data-types';
import { callApi } from '@/util/api';
import { decode } from '@/util';
import 'chartjs-adapter-date-fns';
import i18n from '@/i18n/index';
import { useCommon } from '@/stores/common';

const { account_token, account_id } = storeToRefs(useCommon());

const { t } = i18n.global;

const route = useRoute();
const cardInfo = ref<Cards | undefined>();
const priceType = ref('avg');
const colors = ref([
  'rgba(255, 0, 0, 1)', // 紅色
  'rgba(0, 255, 0, 1)', // 綠色
  'rgba(0, 0, 255, 1)', // 藍色
  'rgba(255, 255, 0, 1)', // 黃色
  'rgba(255, 0, 255, 1)', // 洋紅
  'rgba(0, 255, 255, 1)', // 青色
  'rgba(128, 0, 0, 1)', // 深紅色
  'rgba(0, 128, 0, 1)', // 深綠色
  'rgba(0, 0, 128, 1)', // 深藍色
  'rgba(128, 128, 128, 1)', // 灰色
]);

onMounted(async () => {
  if (account_id.value && account_token.value) priceType.value = 'lowest';
  cardInfo.value = decode<HasTotalRes<CardsList>>(
    (
      await callApi<CardListType>(
        { page: 0, limit: 1, filter: { id: route.params.id as string, number: route.query.number ? route.query.number as string : '' } },
        'cards',
        'list',
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
      & img {
        width: 300px;
      }
    }
  }
  & .chart-box {
    @apply overflow-hidden;
    width: 1200px;
    margin: 0 auto;
    border-radius: 10px;
    .select-box {
      @apply mb-2 flex flex-row;
      p {
        @apply text-white text-2xl mr-2;
      }
    }
  }
}

@media (max-width: 1200px) {
  .cards-detail {
    & .card-container {
      @apply flex justify-between;
      width: 900px;
      & .left-box {
        width: 650px;
        & .name {
          font-size: 22px;
          padding: 0 0 0 10px;
        }
        & .effect {
          font-size: 16px;
        }
        & .info-box {
          font-size: 16px;
        }
      }
      & .right-box {
        & img {
          width: 180px;
        }
      }
    }
    & .chart-box {
      width: 900px;
    }
  }
}

@media (max-width: 900px) {
  .cards-detail {
    & .card-container {
      @apply flex justify-between;
      width: 760px;
      padding: 20px;
      & .left-box {
        width: 520px;
        & .name {
          font-size: 22px;
          padding: 0 0 0 10px;
        }
        & .effect {
          font-size: 16px;
          margin: 5px 0 10px;
        }
        & .info-box {
          font-size: 16px;
        }
      }
      & .right-box {
        & img {
          width: 180px;
        }
      }
    }
    & .chart-box {
      width: 760px;
    }
  }
}

@media (max-width: 768px) {
  .cards-detail {
    min-height: calc(100vh - 101px);
    padding: 30px 0;
    & .card-container {
      @apply flex flex-col-reverse justify-between;
      width: 95vw;
      margin: 0 auto 30px;
      padding: 20px;
      & .left-box {
        @apply w-full;
        & .name {
          font-size: 22px;
          padding: 0;
        }
        & .effect {
          font-size: 16px;
          padding: 0;
          margin: 5px 0 20px;
        }
        & .info-box {
          @apply w-full;
          font-size: 16px;
        }
      }
      & .right-box {
        margin: 0 0 10px;
      }
    }
    & .chart-box {
      width: 95vw;
    }
  }
}
</style>
