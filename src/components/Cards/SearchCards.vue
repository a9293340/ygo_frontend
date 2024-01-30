<template>
  <div class="search-cards">
    <div class="form-container">
      <!-- 卡號 -->
      <div class="item-box">
        <div class="item-title">{{ t('card.id') + '：' }}</div>
        <input
          v-model="listQuery.filter.id"
          type="text"
          :placeholder="t('card.input_id')"
          @keyup.enter.native="searchNewData"
        />
      </div>
      <!-- 卡片名稱 -->
      <div class="item-box">
        <div class="item-title">{{ t('card.name') + '：' }}</div>
        <input
          v-model="listQuery.filter.name"
          type="text"
          :placeholder="t('card.input_name')"
          @keyup.enter.native="searchNewData"
        />
      </div>
      <!-- 卡片密碼 -->
      <div class="item-box">
        <div class="item-title">{{ t('card.number') + '：' }}</div>
        <input
          v-model="listQuery.filter.number"
          type="text"
          @input="
            () => {
              forbiddenType = null;
              if (typeof listQuery.filter.number === 'string')
                listQuery.filter.number = listQuery.filter.number?.replace(
                  /[^\d]/g,
                  ''
                );
            }
          "
          :placeholder="t('card.input_number')"
          @keyup.enter.native="searchNewData"
        />
      </div>
      <!-- 包裝分類 -->
      <div class="item-box">
        <div class="item-title">
          {{ t('card.product_information_type') + '：' }}
        </div>
        <el-select
            v-model="listQuery.filter.product_information_type"
            filterable
            clearable
            class="search-cards-select"
            :placeholder="t('card.please_choose')"
            @keyup.enter.native="searchNewData"
        >
          <el-option
              v-for="(item, index) in packTypeList"
              :key="index"
              :label="item.name"
              :value="item.packType"
          />
        </el-select>
      </div>
      <!-- 種類 -->
      <div v-if="isShowAdvance" class="item-box">
        <div class="item-title">{{ t('card.type') + '：' }}</div>
        <el-select
          v-model="listQuery.filter.type"
          filterable
          clearable
          class="search-cards-select"
          :placeholder="t('card.please_choose')"
          @keyup.enter.native="searchNewData"
        >
          <el-option
            v-for="(item, index) in ygoOptions.type"
            :key="index"
            :label="item"
            :value="item"
            style="font-size: 16px; color: #333333"
          />
        </el-select>
      </div>
      <!-- 星數 -->
      <div v-if="isShowAdvance" class="item-box">
        <div class="item-title">{{ t('card.star') + '：' }}</div>
        <el-select
          v-model="listQuery.filter.star"
          filterable
          clearable
          class="search-cards-select"
          :placeholder="t('card.please_choose')"
          @keyup.enter.native="searchNewData"
        >
          <el-option
            v-for="(item, index) in ygoOptions.star"
            :key="index"
            :label="item"
            :value="item"
            style="font-size: 16px; color: #333333"
          />
        </el-select>
      </div>
      <!-- 屬性 -->
      <div v-if="isShowAdvance" class="item-box">
        <div class="item-title">{{ t('card.attribute') + '：' }}</div>
        <el-select
          v-model="listQuery.filter.attribute"
          filterable
          clearable
          class="search-cards-select"
          :placeholder="t('card.please_choose')"
          @keyup.enter.native="searchNewData"
        >
          <el-option
            v-for="(item, index) in ygoOptions.attribute"
            :key="index"
            :label="item"
            :value="item"
            style="font-size: 16px; color: #333333"
          />
        </el-select>
      </div>
      <!-- 種族 -->
      <div v-if="isShowAdvance" class="item-box">
        <div class="item-title">{{ t('card.race') + '：' }}</div>
        <el-select
          v-model="listQuery.filter.race"
          filterable
          clearable
          class="search-cards-select"
          :placeholder="t('card.please_choose')"
          @keyup.enter.native="searchNewData"
        >
          <el-option
            v-for="(item, index) in ygoOptions.race"
            :key="index"
            :label="item"
            :value="item"
            style="font-size: 16px; color: #333333"
          />
        </el-select>
      </div>
      <!-- 稀有度 -->
      <div v-if="isShowAdvance" class="item-box">
        <div class="item-title">{{ t('card.rarity') + '：' }}</div>
        <el-select
          v-model="listQuery.filter.rarity"
          filterable
          clearable
          class="search-cards-select"
          :placeholder="t('card.please_choose')"
          @keyup.enter.native="searchNewData"
        >
          <el-option
            v-for="(item, index) in ygoOptions.rare"
            :key="index"
            :label="item"
            :value="item"
            style="font-size: 16px; color: #333333"
          />
        </el-select>
      </div>
      <!-- 禁卡表 -->
      <div v-if="isShowAdvance" class="item-box">
        <div class="item-title">
          {{ t('card.forbidden') + '：' }}
        </div>
        <el-select
          v-model="forbiddenType"
          filterable
          clearable
          class="search-cards-select"
          :placeholder="t('card.please_choose')"
          @change="
            () => {
              listQuery.filter.number = '';
            }
          "
          @keyup.enter.native="searchNewData"
        >
          <el-option
            v-for="(item, index) in forbiddenTypeList"
            :key="index"
            :label="item"
            :value="index"
            style="font-size: 16px; color: #333333"
          />
        </el-select>
      </div>
      <!-- 攻擊力 -->
      <div v-if="isShowAdvance" class="item-box">
        <div class="item-title">{{ t('card.atk') + '：' }}</div>
        <input
          v-model="listQuery.filter.atk_l"
          type="text"
          @input="
            listQuery.filter.atk_l =
              typeof listQuery.filter.atk_l === 'string'
                ? listQuery.filter.atk_l.replace(/[^\d]/g, '')
                : listQuery.filter.atk_l
          "
          @keyup.enter.native="searchNewData"
        />
        <span>~</span>
        <input
          v-model="listQuery.filter.atk_t"
          type="text"
          @input="
            listQuery.filter.atk_t =
              typeof listQuery.filter.atk_t === 'string'
                ? listQuery.filter.atk_t.replace(/[^\d]/g, '')
                : listQuery.filter.atk_t
          "
          @keyup.enter.native="searchNewData"
        />
      </div>
      <!-- 守備力 -->
      <div v-if="isShowAdvance" class="item-box">
        <div class="item-title">{{ t('card.def') + '：' }}</div>
        <input
          v-model="listQuery.filter.def_l"
          type="text"
          @input="
            listQuery.filter.def_l =
              typeof listQuery.filter.def_l === 'string'
                ? listQuery.filter.def_l.replace(/[^\d]/g, '')
                : listQuery.filter.def_l
          "
          @keyup.enter.native="searchNewData"
        />
        <span>~</span>
        <input
          v-model="listQuery.filter.def_t"
          type="text"
          @input="
            listQuery.filter.def_t =
              typeof listQuery.filter.def_t === 'string'
                ? listQuery.filter.def_t.replace(/[^\d]/g, '')
                : listQuery.filter.def_t
          "
          @keyup.enter.native="searchNewData"
        />
      </div>
      <button class="search-btn" @click="searchNewData">
        {{ t('card.search') }}
      </button>
    </div>
    <div class="toggle-btn mobile" @click="isShowAdvance = !isShowAdvance">
      <div class="flex justify-center items-center">
        <div>{{ t('card.advance_search') }}</div>
        <el-icon v-if="isShowAdvance"><CaretTop /></el-icon>
        <el-icon v-else><CaretBottom /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ygoOptions } from '@/config/ygo';
import type {
  CardListType,
  PackTypeListType,
  forbiddenCardListType,
} from 'request-data-types';
import type { PaginationGetList } from 'common-types';
import type { CardsList, PackTypeList, forbiddenCardList } from 'module-types';
import type { HasTotalRes, NotHasTotalRes } from 'response-data-types';
import { decode, removeNullAndEmptyString } from '@/util';
import { callApi } from '@/util/api';
import i18n from '@/i18n/index';
import { useDeckStore } from '@/stores/deck';

const { t } = i18n.global;
interface SearchCardsProps {
  page: number;
  limit: number;
}

const route = useRoute();
const router = useRouter();
const emit = defineEmits(['get:data']);
const { searchCardsId } = storeToRefs(useDeckStore());
const props = withDefaults(defineProps<SearchCardsProps>(), {
  limit: 20,
  page: 1,
});
const forbiddenType = ref('');
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
    product_information_type: '',
  },
});
const forbiddenTypeList = ref({
  0: t('card.not_use'),
  1: t('card.only_one'),
  2: t('card.only_two'),
  3: t('card.forbidden_all'),
});

const isShowAdvance = ref<Boolean>(false);
const packTypeList = ref<PackTypeList | []>([]);
const page = computed(() => props.page);
watch(page, newVal => {
  getList({
    limit: props.limit,
    page: props.page,
  });
});

watch(searchCardsId, newVal => {
  if (!newVal) return;

  listQuery.value.filter = {
    id: newVal,
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
    product_information_type: '',
  };
  forbiddenType.value = '';

  searchNewData();
});

const searchNewData = () => {
  getList({ page: 0, limit: listQuery.value.limit });
};

const getList = async (val: PaginationGetList) => {
  await getCards(val.page);
};
const getCards = async (page: number) => {
  if (
    listQuery.value.filter.atk_l !== '' &&
    typeof listQuery.value.filter.atk_l === 'string'
  ) {
    listQuery.value.filter.atk_l = parseInt(listQuery.value.filter.atk_l);
  }
  if (
    listQuery.value.filter.atk_t !== '' &&
    typeof listQuery.value.filter.atk_t === 'string'
  ) {
    listQuery.value.filter.atk_t = parseInt(listQuery.value.filter.atk_t);
  }
  if (
    listQuery.value.filter.def_l !== '' &&
    typeof listQuery.value.filter.def_l === 'string'
  ) {
    listQuery.value.filter.def_l = parseInt(listQuery.value.filter.def_l);
  }
  if (
    listQuery.value.filter.def_t !== '' &&
    typeof listQuery.value.filter.def_t === 'string'
  ) {
    listQuery.value.filter.def_t = parseInt(listQuery.value.filter.def_t);
  }
  listQuery.value.filter.id = listQuery.value.filter.id.toUpperCase();
  listQuery.value.page = page;
  listQuery.value.limit = props.limit;

  let forbidden_numbers: string[] = [];
  // route query
  let query = {
    ...removeNullAndEmptyString(listQuery.value.filter),
  };
  // 僅卡片搜尋需要紀錄page
  if (route.path.indexOf('deck') === -1) query['page'] = page;
  else if (route.query.deck_admin_id && route.path.indexOf('deck') !== -1)
    query['deck_admin_id'] = route.query.deck_admin_id;

  // 禁卡表紀錄
  if (forbiddenType.value) {
    query['forbidden'] = forbiddenType.value;
    const forbidden_filter =
      forbiddenType.value === '3'
        ? {}
        : { type: parseInt(forbiddenType.value) };
    const forbiddenList = decode<NotHasTotalRes<forbiddenCardList>>(
      (
        await callApi<forbiddenCardListType>(
          forbidden_filter,
          'forbiddenCardList',
          'list',
          false
        )
      ).data
    ).list;
    forbidden_numbers = forbiddenList.map(x => x.number);
  }

  let filter = removeNullAndEmptyString(listQuery.value);
  if (forbidden_numbers.length) {
    filter.filter.number = forbidden_numbers;
  }

  // 紀錄router query
  await router.replace({
    query,
  });

  const cards = decode<HasTotalRes<CardsList>>(
    (await callApi<CardListType>(filter, 'cards', 'list', false)).data
  );
  // console.log(cards);
  emit('get:data', {
    cards,
    listQuery: listQuery.value,
  });
};

const getPackType = async () => {
  packTypeList.value = decode<HasTotalRes<PackTypeList>>(
    (
      await callApi<PackTypeListType>(
        {
          page: 0,
          limit: 0,
          filter: {
            status: 0,
          },
        },
        'packType',
        'list',
        false
      )
    ).data
  ).list.map(el => ({
    name: el.name,
    packType: el.packType,
  }));

  localStorage.setItem(
    'ygo-pack',
    JSON.stringify({
      list: packTypeList.value,
      date: new Date(),
    })
  );
};

onMounted(async () => {
  // 是否展開進階搜尋
  if (window.innerWidth > 768) {
    isShowAdvance.value = true
  } else {
    // 手機版檢查query是否只有page、id、number、name或product_information_type參數
    // 若有其他參數則展開進階搜尋
    const allowedProps = new Set(['page', 'id', 'number', 'name', 'product_information_type']);
    const keys = Object.keys(route.query);
    isShowAdvance.value = keys.some(key => !allowedProps.has(key));
  }
  if (!packTypeList.value.length) {
    const localPack = localStorage.getItem('ygo-pack');

    if (typeof localPack === 'string') {
      const pack = JSON.parse(localPack) as {
        list: PackTypeList;
        date: string;
      };

      if (
        new Date().getTime() - new Date(pack.date).getTime() >=
        24 * 60 * 60 * 1000
      )
        await getPackType();
      else packTypeList.value = pack.list;
    } else await getPackType();
  }
  // 避免吃到deck的query
  let query = JSON.parse(JSON.stringify(route.query));
  if (query.deck_admin_id) delete query.deck_admin_id;
  // page
  if (query.page) {
    listQuery.value.page = parseInt(query.page);
    delete query.page;
  }
  // forbidden
  if (query.forbidden) {
    forbiddenType.value = query.forbidden;
    delete query.forbidden;
  }
  listQuery.value.filter = { ...listQuery.value.filter, ...query };
  // listQuery.value.filter.number = '';
  await getCards(listQuery.value.page);
});
</script>

<style lang="scss" scoped>
.el-select-dropdown__item {
  color: #333333;
  font-size: 16px;
}
.search-cards {
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
      & .search-cards-select {
        width: 150px;
        :deep(.el-select__wrapper) {
          font-size: 16px;
          overflow: hidden;
          padding: 0 11px;
          box-shadow: none;
          border-radius: 5px;
          height: 36px;
        }
        :deep(.el-select__selected-item) {
          color: #1e40af;
        }
        :deep(.el-select__selected-item).is-transparent {
          color: #ababb2;
        }
      }
      & input {
        @apply bg-white;
        color: #1e40af;
        padding: 6px 11px;
        border-radius: 5px;
        width: 150px;
        &::placeholder {
          color: #ababb2;
        }
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
    @apply cursor-pointer;
    color: lightgray;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-top: transparent;
    width: 120px;
    margin: 0 auto 20px;
    padding: 2px 0;
    border-radius: 0 0 5px 5px;
    transition-duration: 0.2s;
    &:hover {
      @apply text-white;
      border: 1px solid rgba(255, 255, 255, 0.5);
    }
  }
}

@media (max-width: 1200px) {
  .search-cards {
    & .form-container {
      width: 900px ;
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
  .search-cards {
    & .form-container {
      width: 760px;
      & .item-box {
        & .search-cards-select {
          width: 140px;
        }
        & input {
          width: 140px;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .search-cards {
    & .form-container {
      @apply w-full;
      & .item-box {
        font-size: 16px;
        margin: 0 5px 10px;
        & .item-title {
          color: lightgray;
          margin: 0 0 3px;
        }
        & .search-cards-select {
          width: 45vw;
        }
        & input {
          padding: 6px 8px;
          border-radius: 5px;
          width: 45vw;
        }
        & span {
          color: lightgray;
          margin: 0 0.25px;
        }
      }
    }
  }
}
</style>
