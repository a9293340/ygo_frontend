<template>
  <div class="cards-wrapper" @click="chosenCard = ''">
    <div class="form-container" :class="{'close-form': !isShowForm}">
      <div v-if="!isShowForm" class="mask mobile">{{ $t('card.show_form') }}</div>
      <!-- 卡號 -->
      <div class="item-box">
        <div class="item-title">{{ $t('card.id') + '：' }}</div>
        <input
            v-model="listQuery.filter.id"
            type="text"
            :placeholder="$t('card.input_id')"
        >
      </div>
      <!-- 卡片名稱 -->
      <div class="item-box">
        <div class="item-title">{{ $t('card.name') + '：' }}</div>
        <input
            v-model="listQuery.filter.name"
            type="text"
            :placeholder="$t('card.input_name')"
        >
      </div>
      <!-- 卡片密碼 -->
      <div class="item-box">
        <div class="item-title">{{ $t('card.number') + '：' }}</div>
        <input
            v-model="listQuery.filter.number"
            type="text"
            @input="listQuery.filter.number = listQuery.filter.number.replace(/[^\d]/g,'')"
            :placeholder="$t('card.input_number')"
        >
      </div>
      <!-- 種類 -->
      <div class="item-box">
        <div class="item-title">{{ $t('card.type') + '：' }}</div>
        <select v-model="listQuery.filter.type">
          <option value=""></option>
          <option v-for="(item, index) in ygoOptions.type" :value="item" :key="index">{{ item }}</option>
        </select>
      </div>
      <!-- 星數 -->
      <div class="item-box">
        <div class="item-title">{{ $t('card.star') + '：' }}</div>
        <select v-model="listQuery.filter.star">
          <option value=""></option>
          <option v-for="(item, index) in ygoOptions.star" :value="item" :key="index">{{ item }}</option>
        </select>
      </div>
      <!-- 屬性 -->
      <div class="item-box">
        <div class="item-title">{{ $t('card.attribute') + '：' }}</div>
        <select v-model="listQuery.attribute">
          <option value=""></option>
          <option v-for="(item, index) in ygoOptions.attribute" :value="item" :key="index">{{ item }}</option>
        </select>
      </div>
      <!-- 種族 -->
      <div class="item-box">
        <div class="item-title">{{ $t('card.race') + '：' }}</div>
        <select v-model="listQuery.filter.race">
          <option value=""></option>
          <option v-for="(item, index) in ygoOptions.race" :value="item" :key="index">{{ item }}</option>
        </select>
      </div>
      <!-- 稀有度 -->
      <div class="item-box">
        <div class="item-title">{{ $t('card.rarity') + '：' }}</div>
        <select v-model="listQuery.filter.rarity">
          <option value=""></option>
          <option v-for="(item, index) in ygoOptions.rare" :value="item" :key="index">{{ item }}</option>
        </select>
      </div>
      <!-- 包裝分類 -->
      <div class="item-box">
        <div class="item-title">{{ $t('card.product_information_type') + '：' }}</div>
        <select v-model="listQuery.filter.product_information_type">
          <option value=""></option>
        </select>
      </div>
      <!-- 攻擊力 -->
      <div class="item-box">
        <div class="item-title">{{ $t('card.atk') + '：' }}</div>
        <input
            v-model="listQuery.filter.atk_l"
            type="text"
            @input="listQuery.filter.atk_l = listQuery.filter.atk_l.replace(/[^\d]/g,'')"
        >
        <span>~</span>
        <input
            v-model="listQuery.filter.atk_t"
            type="text"
            @input="listQuery.filter.atk_t = listQuery.filter.atk_t.replace(/[^\d]/g,'')"
        >
      </div>
      <!-- 守備力 -->
      <div class="item-box">
        <div class="item-title">{{ $t('card.def') + '：' }}</div>
        <input
            v-model="listQuery.filter.def_l"
            type="text"
            @input="listQuery.filter.def_l = listQuery.filter.def_l.replace(/[^\d]/g,'')"
        >
        <span>~</span>
        <input
            v-model="listQuery.filter.def_t"
            type="text"
            @input="listQuery.filter.def_t = listQuery.filter.def_t.replace(/[^\d]/g,'')"
        >
      </div>
      <button class="search-btn" @click="getList({ page: 0, limit: listQuery.limit })">{{ $t('card.search') }}</button>
    </div>
    <div class="toggle-btn mobile" @click="isShowForm=!isShowForm">
      <el-icon v-if="isShowForm"><CaretTop /></el-icon>
      <el-icon v-else><CaretBottom /></el-icon>
    </div>

    <div class="list-container">
      <div class="card-info-box">
        <div class="card-info-title">
          <div>{{ $t('card.id') }}</div>
          <div class="lg-item">{{ $t('card.name') }}</div>
          <div>{{ $t('card.type') }}</div>
          <div class="sm-item">{{ $t('card.star') }}</div>
          <div class="sm-item">{{ $t('card.attribute') }}</div>
          <div class="sm-item">{{ $t('card.race') }}</div>
          <div class="lg-item">{{ $t('card.rarity') }}</div>
          <div class="sm-item">{{ $t('card.atk') }}</div>
          <div class="sm-item">{{ $t('card.def') }}</div>
          <div>{{ $t('card.number') }}</div>
          <div class="sm-item"></div>
        </div>
        <div class="card-info"
             :class="{'chosen-card': chosenCard === item._id}"
             v-for="item in list"
             :key="item._id"
             @click.stop="chosenCard = item._id"
        >
          <div>{{ item.id }}</div>
          <div class="lg-item">{{ item.name }}</div>
          <div>{{ item.type }}</div>
          <div class="sm-item">{{ item.star }}</div>
          <div class="sm-item">{{ item.attribute }}</div>
          <div class="sm-item">{{ item.race }}</div>
          <div class="lg-item">
          <span v-for="(rarity, rarityIndex) in item.rarity" :key="rarityIndex">
            {{ `${rarity}${item.rarity.length - 1 === rarityIndex ? '' : '、'} `}}
          </span>
          </div>
          <div class="sm-item">{{ item.atk }}</div>
          <div class="sm-item">{{ item.def }}</div>
          <div>{{ item.number }}</div>
          <router-link class="detail sm-item" :to="`/cards/${item._id}`">{{ $t('card.detail') }}</router-link>
        </div>
      </div>
    </div>

    <Pagination
        :hidden="total <= 0"
        :total="total"
        :limit="listQuery.limit"
        :page.sync="listQuery.page"
        @pagination="getList"
    />
  </div>
</template>

<script setup lang="ts">
import type { CardListType } from "request-data-types";
import type { CardsList } from "module-types";
import type { PaginationGetList } from "common-types";
import type { HasTotalRes } from "response-data-types";
import { ygoOptions } from "/src/config/ygo"
import { onMounted } from "vue";
import { callApi } from "@/util/api";
import { decode, removeNullAndEmptyString } from "@/util";

const listQuery = ref<CardListType>({
  page: 0,
  limit: 20,
  filter: {
    id: '',
    number: '',
    name: '',
    type: '',
    star: '',
    race: '',
    attribute: '',
    rarity: '',
    atk_t: '',
    atk_l: '',
    def_t: '',
    def_l: '',
    product_information_type: ''
  }
});
const isShowForm = ref<Boolean>(true);
const list = ref<[] | CardsList>([]);
const total = ref<number>(0);
const getList = async (val: PaginationGetList) => {
  isShowForm.value = false
  listQuery.value.page = val.page;
  await getCards();
};
const getCards = async () => {
  if (listQuery.value.filter.atk_l) {
    listQuery.value.filter.atk_l = parseInt(listQuery.value.filter.atk_l)
  }
  if (listQuery.value.filter.atk_t) {
    listQuery.value.filter.atk_t = parseInt(listQuery.value.filter.atk_t)
  }
  if (listQuery.value.filter.def_l) {
    listQuery.value.filter.def_l = parseInt(listQuery.value.filter.def_l)
  }
  if (listQuery.value.filter.def_t) {
    listQuery.value.filter.def_t = parseInt(listQuery.value.filter.def_t)
  }
  const cards = decode<HasTotalRes<CardsList>>(
      (await callApi<CardListType>(removeNullAndEmptyString(listQuery.value), 'cards', 'list', false)).data,
  )
  list.value = cards.list;
  total.value = cards.total;
};

const chosenCard = ref<string>('')

onMounted(async () => {
  await getCards()
})
</script>

<style lang="scss" scoped>
.cards-wrapper {
  min-height: calc(100vh - 104px);
  padding: 0 0 30px;
  & .form-container {
    @apply flex flex-wrap justify-center relative overflow-hidden;
    width: 1150px;
    margin: 0 auto;
    padding: 20px 0;
    border: 1px solid rgba(255, 255, 255, 0.2);
    & .mask {
      @apply w-full text-center;
      height: 30px;
      color: lightgray;
    }
    & .item-box {
      font-size: 16px;
      margin: 0 5px 10px;
      & .item-title {
        color: lightgray;
        margin: 0 0 3px;
      }
      & input, & select {
        padding: 5px 8px;
        border-radius: 5px;
        width: 150px;
        background-color: rgba(255, 255, 255, 0.9);
      }
      & span {
        color: lightgray;
        margin: 0 0.25px;
      }
    }
    & .search-btn {
      @apply self-end;
      color: lightgray;
      border: 1px solid lightgray;
      padding: 5px 8px;
      border-radius: 5px;
      width: 150px;
      height: 36px;
      margin: 10px 5px 10px;
      transition-duration: 0.2s;
      &:hover {
        @apply text-white;
        border: 1px solid white;
      }
    }
  }
  & .toggle-btn {
    @apply cursor-pointer text-center;
    color: lightgray;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-top: transparent;
    width: 80px;
    margin: 0 auto 20px;
    padding: 2px 0;
    border-radius: 0 0 5px 5px;
    transition-duration: 0.2s;
    &:hover {
      @apply text-white;
      border: 1px solid rgba(255, 255, 255, 0.5);
    }
  }
  & .list-container {
    width: 80vw;
    min-width: 1150px;
    margin: 30px auto;
    & .card-info-box {
      @apply w-full flex flex-col;
      & .card-info-title, & .card-info {
        @apply flex w-full;
        color: lightgray;
        font-size: 16px;
        background-color: rgba(31, 44, 93, 0.6);
        & div {
          @apply flex flex-wrap justify-center items-center text-center;
          border: 1px solid lightgray;
          width: 130px;
          padding: 10px 0;
        }
        & .sm-item {
          width: 80px;
        }
        & .lg-item {
          @apply grow;
        }
        & .detail {
          @apply flex justify-center items-center text-center;
          border: 1px solid lightgray;
          padding: 10px 0;
          transition-duration: 0.2s;
          background-color: #181818;
          &:hover {
            @apply text-white;
            background-color: #333333;
          }
        }
      }
      & .card-info-title {
        background-color: #333333;
      }
      & .card-info {
        @apply cursor-pointer;
        transition-duration: 0.2s;
        &:hover {
          background-color: rgba(31, 44, 93, 0.3);
        }
      }
      & .chosen-card {
        background-color: rgba(31, 44, 93, 0.3);
      }
    }
  }
}

@media (max-width: 1200px) {
  .cards-wrapper {
    & .form-container {
      width: 900px;
    }
    & .list-container {
      width: 95vw;
      min-width: unset;
      overflow-y: scroll;
      & .card-info-box {
        min-width: 1100px;
      }
    }
  }
}

@media (max-width: 900px) {
  .cards-wrapper {
    & .form-container {
      width: 760px;
      & .item-box {
        & input, & select {
          width: 140px;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .cards-wrapper {
    min-height: calc(100vh - 101px);
    & .close-form {
      height: 55px;
    }
    & .form-container {
      @apply w-full;
      & .item-box {
        font-size: 16px;
        margin: 0 5px 10px;
        & .item-title {
          color: lightgray;
          margin: 0 0 3px;
        }
        & input, & select {
          padding: 5px 8px;
          border-radius: 5px;
          width: 45vw;
          background-color: rgba(255, 255, 255, 0.9);
        }
        & span {
          color: lightgray;
          margin: 0 0.25px;
        }
      }
      & .search-btn {
        @apply self-end;
        color: lightgray;
        border: 1px solid lightgray;
        padding: 5px 8px;
        border-radius: 5px;
        width: 150px;
        height: 36px;
        margin: 10px 5px 10px;
        transition-duration: 0.2s;
        &:hover {
          @apply text-white;
          border: 1px solid white;
        }
      }
    }
  }
}
</style>
