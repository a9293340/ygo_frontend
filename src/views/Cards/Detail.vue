<template>
  <div class="cards-detail">
    <div class="card-container">
      <div class="left-box">
        <div class="name">
          {{ !isJp ? cardInfo?.name : jurisprudence?.name_jp_k }}
        </div>
        <div class="effect">
          {{ !isJp ? cardInfo?.effect : jurisprudence?.effect_jp }}
        </div>
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
        <el-switch
          v-if="jurisprudence?.name_jp_k"
          v-model="isJp"
          :active-text="t('card.jp')"
          :inactive-text="t('card.zh')"
          style="
            --el-switch-on-color: lightgray;
            --el-switch-off-color: #1f2c5d;
          "
        />
        <img
          v-if="cardInfo"
          :src="`/api/card-image/cards/${cardInfo?.number}.webp`"
          alt=""
        />
      </div>
    </div>
    <div class="tab-box">
      <button
        :class="{ active: currentType === 'chart' }"
        @click="currentType = 'chart'"
      >
        {{ t('card.price_select') }}
      </button>
      <button
        :class="{ active: currentType === 'qa' }"
        @click="currentType = 'qa'"
      >
        {{ t('card.qa') }}
      </button>
    </div>
    <div v-if="currentType === 'qa'" class="qa-box">
      <div class="ref-link">
        <a :href="jurisprudence?.jud_link" target="_blank">{{
          t('card.qa_ref')
        }}</a>
      </div>
      <div class="qa-item" v-for="(item, index) in qaList" :key="item._id">
        <div class="title-box" @click="showContent(index as number)">
          <div class="date">{{ item.date }}</div>
          <div class="title">
            <div>{{ item.title }}</div>
            <el-icon v-if="item.isShow" class="arrow"><ArrowUpBold /></el-icon>
            <el-icon v-else class="arrow"><ArrowDownBold /></el-icon>
          </div>
        </div>
        <div class="content-box" v-if="item.isShow">
          <div>Question:</div>
          <div>{{ item.q }}</div>
          <br />
          <div>Answer:</div>
          <div>{{ item.a }}</div>
        </div>
      </div>
    </div>
    <div v-if="currentType === 'chart'" class="chart-box">
      <div class="select-box" v-if="account_id && account_token">
        <p>{{ t('card.ruten_price') }} :</p>
        <el-select class="price-select" v-model="priceType">
          <el-option
            value="avg"
            :label="t('card.ruten_average')"
            style="font-size: 16px; color: #333333"
          />
          <el-option
            value="lowest"
            :label="t('card.ruten_low')"
            style="font-size: 16px; color: #333333"
          />
        </el-select>
      </div>
      <PriceChart
        v-if="cardInfo && Array.isArray(cardInfo?.price_info)"
        :type="priceType"
        :rarity="cardInfo?.rarity"
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
import type { CardListType, JurisprudenceListType } from 'request-data-types';
import type { Cards, CardsList, Jurisprudence, Qa } from 'module-types';
import type { HasTotalRes } from 'response-data-types';
import { callApi } from '@/util/api';
import { decode } from '@/util';
import 'chartjs-adapter-date-fns';
import i18n from '@/i18n/index';
import { useCommon } from '@/stores/common';

const { account_token, account_id } = storeToRefs(useCommon());

const { t } = i18n.global;

const route = useRoute();
const router = useRouter();
const cardInfo = ref<Cards | undefined>();
const jurisprudence = ref<Jurisprudence>();
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
const isJp = ref<boolean>(false);
const currentType = ref<string>('chart');

// qa
const qaList = ref<Qa[]>();
const showContent = (index: number) => {
  qaList.value[index].isShow = !qaList.value[index].isShow;
};

onMounted(async () => {
  if (account_id.value && account_token.value) priceType.value = 'lowest';
  if (!route.query.number) {
    await router.push('/cards');
  } else {
    cardInfo.value = decode<HasTotalRes<CardsList>>(
      (
        await callApi<CardListType>(
          {
            page: 0,
            limit: 1,
            filter: {
              id: route.params.id as string,
              number: route.query.number as string,
            },
          },
          'cards',
          'list',
          false
        )
      ).data
    ).list[0];

    jurisprudence.value = decode<HasTotalRes<Jurisprudence>>(
      (
        await callApi<JurisprudenceListType>(
          { number: (route.query.number as string).substring(0, 8) },
          'jurisprudence',
          'list',
          false
        )
      ).data
    ).list[0];
    qaList.value = jurisprudence.value.qa.reverse();
  }
});
</script>

<style lang="scss" scoped>
.cards-detail {
  min-height: calc(100vh - 104px);
  padding: 50px 0;
  & .card-container {
    @apply flex justify-between;
    width: 1200px;
    margin: 0 auto;
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
      :deep(.el-switch__label) {
        color: rgba(51, 51, 51, 0.5);
      }
      :deep(.el-switch__label).is-active {
        color: #1f2c5d;
      }
      & img {
        margin: 5px 0 0;
        width: 300px;
      }
    }
  }
  & .tab-box {
    width: 1200px;
    margin: 30px auto 20px;
    button {
      font-size: 16px;
      color: lightgray;
      border: 1px solid lightgray;
      border-radius: 5px;
      width: 150px;
      height: 36px;
      margin: 0 10px 0 0;
      transition-duration: 0.2s;
      &:hover {
        @apply text-white;
        border: 1px solid white;
      }
    }
    button.active {
      @apply text-white;
      border: 1px solid white;
      background-color: rgba(211, 211, 211, 0.5);
    }
  }
  & .qa-box {
    font-size: 18px;
    width: 1200px;
    margin: 0 auto;
    & .ref-link {
      @apply text-white underline;
      font-size: 16px;
      margin: 0 0 5px 5px;
    }
    & .qa-item {
      @apply text-justify overflow-hidden;
      margin: 0 0 10px;
      border-radius: 5px;
      border: 1px solid lightgrey;
      & .title-box {
        @apply cursor-pointer;
        background-color: #e7e7e7;
        padding: 8px 10px;
        transition-duration: 0.2s;
        &:hover {
          background-color: #e7e7e7;
        }
        & .date {
          color: #1f2c5d;
          font-size: 16px;
        }
        & .title {
          @apply flex justify-between items-center;
          .arrow {
            margin: 0 15px;
          }
        }
      }
      & .content-box {
        color: lightgrey;
        border-top: 1px solid lightgrey;
        padding: 10px;
      }
    }
  }
  & .chart-box {
    @apply overflow-hidden;
    width: 1200px;
    margin: 0 auto;
    border-radius: 10px;
    .select-box {
      @apply mb-3 flex items-center;
      p {
        @apply text-white;
        margin: 0 15px 0 5px;
        font-size: 16px;
      }
      & .price-select {
        width: 150px;
        :deep(.el-select__wrapper) {
          font-size: 16px;
          overflow: hidden;
          box-shadow: none;
          border-radius: 5px;
          height: 32px;
        }
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
    & .tab-box {
      width: 900px;
    }
    & .qa-box {
      width: 900px;
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
    & .tab-box {
      width: 760px;
    }
    & .qa-box {
      width: 760px;
      & .qa-item {
        & .title-box {
          & .title {
            .arrow {
              margin: 0 10px;
            }
          }
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
    & .tab-box {
      @apply text-center;
      width: 95vw;
    }
    & .qa-box {
      font-size: 16px;
      width: 95vw;
      & .qa-item {
        & .title-box {
          padding: 5px 10px;
          & .date {
            font-size: 14px;
          }
          & .title {
            .arrow {
              margin: 0 5px 0 10px;
            }
          }
        }
      }
    }
    & .chart-box {
      width: 95vw;
      .select-box {
        @apply mb-3 flex justify-center items-center;
      }
    }
  }
}
</style>
