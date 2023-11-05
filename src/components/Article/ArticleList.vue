<template>
  <div class="article-list">
    <div class="article-container">
      <div class="title-box">
        <h1 class="list-title">{{ props.title }}</h1>
        <div class="search">
          <input v-model="listQuery.title" type="text" placeholder="Search..." />
          <el-icon class="search-icon" @click="getList({ page: 0, limit: listQuery.limit })"
            ><Search
          /></el-icon>
        </div>
      </div>
      <div class="list-container">
        <router-link
          :to="`/meta_deck/${item._id}`"
          class="list-item"
          v-for="item in list"
          :key="item._id"
        >
          <div
            class="img"
            :style="
              item.photo ? `background-image: url(/api/card-image/article/${item.photo})` : ''
            "
          ></div>
          <div class="content">
            <div class="title">{{ item.title }}</div>
            <div class="detail">
              <div class="tag-list">
                <span v-for="(tagItem, tagIndex) in item.tag" :key="tagIndex">{{
                  `#${tagItem.tag}`
                }}</span>
              </div>
              <div class="article-info">
                <div>{{ `${$t('article.author')}：${item.author_name}` }}</div>
                <div>{{ `${$t('article.date')}：${formatDateString(item.publish_date)}` }}</div>
              </div>
            </div>
          </div>
        </router-link>
      </div>

      <Pagination
        :hidden="total <= 0"
        :total="total"
        :limit="listQuery.limit"
        :page.sync="listQuery.page"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BaseArticleList, NormalArticleList } from 'module-types';
import type { SearchArticleType } from 'request-data-types';
import type { HasTotalRes } from 'response-data-types';
import type { PaginationGetList } from 'common-types';

import { callApi } from '@/util/api';
import { formatDateString } from '@/util/parseDate';
import { decode } from '@/util';

const props = defineProps({
  type: {
    type: Number,
    default: 0,
  },
  subType: {
    type: Number,
    default: null,
  },
  title: {
    type: String,
    default: '',
  },
});

// 搜尋
const listQuery = ref<SearchArticleType>({
  page: 0,
  limit: 5,
  title: '',
  article_type: 0,
  article_subtype: null,
  status: 0,
});
const list = ref<[] | BaseArticleList | NormalArticleList>([]);
const total = ref<number>(0);
const getList = async (val: PaginationGetList) => {
  listQuery.value.page = val.page;
  await getArticle();
};

const getArticle = async () => {
  const article =
    listQuery.value.article_type === 0 || listQuery.value.article_type === 4
      ? decode<HasTotalRes<BaseArticleList>>(
          (await callApi<SearchArticleType>(listQuery.value, 'search', 'list', false)).data,
        )
      : decode<HasTotalRes<NormalArticleList>>(
          (await callApi<SearchArticleType>(listQuery.value, 'search', 'list', false)).data,
        );

  list.value = article.list;
  total.value = article.total;
  console.log(list.value);
};

onMounted(async () => {
  listQuery.value.article_type = props.type;
  listQuery.value.article_subtype = props.subType;

  await getArticle();
});
</script>

<style scoped lang="scss">
.article-list {
  min-height: calc(100vh - 104px);
  & .article-container {
    width: 1000px;
    margin: 0 auto;
    padding: 24px 0;
    & .title-box {
      @apply flex justify-between items-end;
      & .list-title {
        @apply text-white inline-block;
        font-size: 24px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.5);
        padding: 0 5px;
      }
      & .search {
        @apply flex items-center;
        border-bottom: 1px solid #707070;
        & input {
          @apply border-none outline-none text-white bg-transparent;
          width: 130px;
          padding: 5px 5px 2px;
          font-size: 18px;
        }
        & .search-icon {
          @apply text-white cursor-pointer;
          color: lightgray;
          font-size: 20px;
          transition-duration: 0.2s;
          &:hover {
            @apply text-white;
          }
        }
      }
    }
    & .list-container {
      margin: 20px 0;
      & .list-item {
        @apply flex justify-between bg-white;
        padding: 15px;
        margin: 0 0 20px 0;
        border-radius: 10px;
        transition-duration: 0.2s;
        &:hover {
          background-color: rgba(255, 255, 255, 0.9);
        }
        & .img {
          @apply bg-no-repeat bg-cover bg-center overflow-hidden;
          width: 270px;
          height: 170px;
          border-radius: 5px;
        }
        & .content {
          @apply flex flex-col justify-between;
          width: 685px;
          & .title {
            @apply font-bold;
            font-size: 20px;
            color: #333333;
          }
          & .detail {
            @apply flex justify-between items-end;
            & .tag-list {
              & span {
                color: #1f2c5d;
                font-size: 18px;
                margin: 0 10px 0 0;
              }
            }
            & .article-info {
              color: #636363;
              font-size: 18px;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 1050px) {
  .article-list {
    & .article-container {
      width: 740px;

      & .list-container {
        margin: 15px 0;
        & .list-item {
          padding: 10px;
          margin: 0 0 15px 0;
          & .img {
            width: 243px;
            height: 153px;
          }
          & .content {
            width: 468px;
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .article-list {
    min-height: calc(100vh - 101px);
    & .article-container {
      @apply w-full;
      padding: 4vw;
      & .list-title {
        font-size: 20px;
      }
      & .list-container {
        margin: 4vw 0;
        & .list-item {
          @apply flex flex-col justify-between items-center w-full;
          padding: 3vw 2.6vw;
          margin: 0 0 4vw 0;
          & .img {
            width: 86vw;
            height: 54vw;
          }
          & .content {
            width: 86vw;
            & .title {
              font-size: 18px;
              margin: 5px 0 0;
            }
            & .detail {
              @apply flex flex-col-reverse justify-between items-start;
              margin: 2vw 0 0 0;
              & .tag-list {
                margin: 2vw 0 0 0;
                & span {
                  font-size: 16px;
                  margin: 0 1.3vw 0 0;
                }
              }
              & .article-info {
                font-size: 16px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
