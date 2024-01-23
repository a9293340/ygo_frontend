<template>
  <div class="deck-list">
    <div class="list-container">
      <h1 class="list-title">{{ t('menu.my_deck') }}</h1>
      <div class="deck-info-box">
        <div class="deck-info-title">
          <div class="lg-item">{{ t('deck.deck_name') }}</div>
          <div class="sm-item">{{ t('deck.deck_time_create') }}</div>
          <div class="sm-item">{{ t('deck.deck_time_edit') }}</div>
          <div class="action-item"></div>
        </div>
        <div
          class="deck-info"
          :class="{ 'chosen-deck': chosenCard === item.title }"
          v-for="(item, i) in deckList"
          :key="item.title"
          @click.stop="chosenCard = item.title ? item.title : ''"
        >
          <div class="lg-item">{{ item.title }}</div>
          <div class="sm-item">{{ formatDateString(item.create_date) }}</div>
          <div class="sm-item">{{ formatDateString(item.last_edit_date) }}</div>
          <div class="action-item">
            <el-button class="pc" type="warning" @click="editDeck(i)">{{
              t('deck.edit')
            }}</el-button>
            <el-button class="pc" type="danger" @click="removeDeck(i)">{{
              t('deck.remove')
            }}</el-button>
            <el-button type="primary" @click="goToDetail(item._id)">{{
              t('deck.detail')
            }}</el-button>
          </div>
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
import type { HasTotalRes } from 'response-data-types';
import type { DeckListType, DeckDeleteType } from 'request-data-types';
import type { PaginationGetList } from 'common-types';
import type { DeckList } from 'module-types';
import { formatDateString } from '@/util/parseDate';
import { decode, removeNullAndEmptyString } from '@/util';
import { callApi } from '@/util/api';
import i18n from '@/i18n/index';
import { useRoute, useRouter } from 'vue-router';
import { useDeckStore } from '@/stores/deck';
import { useCommon } from '@/stores/common';

const { account_id } = storeToRefs(useCommon());

const { t } = i18n.global;
const route = useRoute();
const router = useRouter();
const { pick_deck_id, isCopy } = storeToRefs(useDeckStore());

const deckList = ref<DeckList>([]);
const chosenCard = ref('');
const total = ref(0);
const date = ref<any>('');
const removeVisible = ref(false);
const editVisible = ref(false);
const dialogVisible = ref(false);

const listQuery = ref<DeckListType>({
  page: 0,
  limit: 20,
  filter: {
    admin_id: '',
    title: '',
    begin_date: '',
    end_date: '',
  },
});

const getList = async (val: PaginationGetList) => {
  listQuery.value.filter.begin_date = date.value
    ? new Date(date.value[0]).toDateString()
    : '';
  listQuery.value.filter.end_date = date.value
    ? new Date(date.value[1]).toDateString()
    : '';
  listQuery.value.page = val.page;
  listQuery.value.filter.admin_id = account_id.value;
  const data = decode<HasTotalRes<DeckList>>(
    (
      await callApi<DeckListType>(
        removeNullAndEmptyString(listQuery.value),
        'deck',
        'deckList',
        false
      )
    ).data
  );
  deckList.value = data.list;
  total.value = data.total;
  await router.replace({
    query: removeNullAndEmptyString(listQuery.value.filter),
  });
  console.log(deckList.value);
};

watch(dialogVisible, newVal => {
  if (!newVal) {
    removeVisible.value = false;
    editVisible.value = false;
  }
});

const removeDeck = async (i: number) => {
  const target_id = deckList.value[i];
  console.log(target_id);

  if (target_id) {
    if (!confirm(t('deck.confirm_to_delete'))) return;
    try {
      await callApi<DeckDeleteType>(
        { _id: target_id._id },
        'deck',
        'delete',
        false
      );
    } catch (error) {}

    await getList({ limit: listQuery.value.limit, page: 0 });
  }
};

const editDeck = (i: number) => {
  const target_id = deckList.value[i];
  if (target_id) {
    pick_deck_id.value = target_id._id;
    isCopy.value = false;
    router.push('/deck/add');
  }
};

const goToDetail = _id => {
  router.push(`/deck/${_id}`);
};

onMounted(async () => {
  if (!account_id.value) router.push('/deck');

  listQuery.value.filter = { ...listQuery.value.filter, ...route.query };
  if (route.query.begin_date && route.query.end_date) {
    date.value = [
      route.query.begin_date as string,
      route.query.end_date as string,
    ];
  }
  if (typeof route.query.page === 'string')
    listQuery.value.page = parseInt(route.query.page);
  await getList({ limit: listQuery.value.limit, page: 0 });
});
</script>

<style lang="scss">
.el-dialog.pop {
  width: 500px;
  font-size: 16px;
  & .pop-content {
    @apply flex flex-col w-4/5;
    margin: 0 auto;
    button {
      @apply self-end;
      width: 100px;
    }
  }
}
@media (max-width: 768px) {
  .el-dialog.pop {
    width: 80vw;
  }
}
</style>

<style lang="scss" scoped>
.deck-list {
  min-height: calc(100vh - 104px);
  & .list-container {
    width: 80vw;
    min-width: 1150px;
    margin: 24px auto;
    overflow-x: scroll;
    overscroll-behavior-x: contain;
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    &::-webkit-scrollbar-track {
      border-radius: 3px;
    }
    &::-webkit-scrollbar-thumb {
      -webkit-border-radius: 4px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.5);
    }
    & .deck-info-box {
      min-width: 800px;
    }
    & .list-title {
      @apply text-white inline-block;
      font-size: 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.5);
      padding: 0 5px;
    }
    & .deck-info-box {
      @apply w-full flex flex-col;
      margin: 20px 0 0;
      & .deck-info-title,
      & .deck-info {
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
          width: 150px;
        }
        & .lg-item {
          @apply grow;
        }
        & .action-item {
          width: 250px;
        }
      }
      & .deck-info-title {
        background-color: #333333;
      }
      & .deck-info {
        @apply cursor-pointer;
        transition-duration: 0.2s;
        &:hover {
          background-color: rgba(31, 44, 93, 0.3);
        }
      }
      & .chosen-deck {
        background-color: rgba(31, 44, 93, 0.3);
      }
    }
  }
}

@media (max-width: 1200px) {
  .deck-list {
    & .search-bar {
      width: 900px;
    }
    & .list-container {
      width: 95vw;
      min-width: unset;
      & .deck-info-box {
        & .deck-info-title,
        & .deck-info {
          & .sm-item {
            width: 120px;
          }
          & .action-item {
            width: 230px;
          }
        }
      }
    }
  }
}

@media (max-width: 900px) {
  .deck-list {
    & .search-bar {
      width: 760px;
      & .item-box {
        & input {
          width: 150px;
        }
      }
      :deep(.el-date-editor) {
        width: 300px;
      }
      & .search-btn {
        width: 100px;
      }
    }
    & .list-container {
      width: 95vw;
      min-width: unset;
    }
  }
}

@media (max-width: 768px) {
  .deck-list {
    min-height: calc(100vh - 101px);
    & .list-container {
      margin: 4vw auto;
      & .deck-info-box {
        & .deck-info-title,
        & .deck-info {
          & .action-item {
            width: 90px;
            button {
              margin: 0;
            }
          }
        }
      }
    }
  }
}
</style>
