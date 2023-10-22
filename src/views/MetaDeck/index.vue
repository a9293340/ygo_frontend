<template>
  <div class="meta-deck-list">
    <div class="article-container">
      <h1 class="list-title">{{ $t('menu.meta_deck') }}</h1>
      <div class="list-container">
        <router-link :to="`/meta_deck/${item._id}`" class="list-item" v-for="item in list" :key="item._id">
          <div class="img" :style="`background-image: url(${item.photo})`"></div>
          <div class="content">
            <div class="title">{{ item.title }}</div>
            <div class="detail">
              <div class="tag-list">
                <span v-for="(tagItem, tagIndex) in item.tag" :key="tagIndex">{{ `#${tagItem}` }}</span>
              </div>
              <div class="article-info">
                <div>{{ `${$t('article.author')}：${item.admin_name}` }}</div>
                <div>{{ `${$t('article.date')}：${item.publish_date}` }}</div>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { BaseArticleList } from 'module-types';

// const currentPage = ref<number>(0)
// const total = ref<number>(0)

const list = ref<BaseArticleList>([
  {
    "_id": "abc1234567",
    "title": "[基礎介紹] 閃刀姬牌組介紹 (閃刀/閃刀姫/Sky Striker)",
    "publish_date": "2023/10/18",
    "photo": "https://picsum.photos/300/200",
    "content": "11111內容內容內容內容內容內容內容內容",
    "status": 0,
    "to_top": true,
    "admin_name": "寶可夢大師-康哥",
    "admin_id": "admin_id12345",
    "tag": ['主流']
  },
  {
    "_id": "abc1234568",
    "title": "文章標題2222",
    "publish_date": "2023/10/22",
    "photo": "https://picsum.photos/600/400",
    "content": "222222內容內容內容內容內容內容內容內容",
    "status": 0,
    "to_top": false,
    "admin_name": "有錢倫",
    "admin_id": "admin_id12346",
    "tag": ['主流2', '閃刀姬']
  }
])
</script>

<style lang="scss" scoped>
.meta-deck-list {
  @apply bg-black;
  & .article-container {
    width: 1000px;
    margin: 0 auto;
    padding: 24px 0;
    & .list-title {
      @apply text-white inline-block;
      font-size: 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.5);
      padding: 0 5px;
    }
    & .list-container {
      margin: 20px 0;
      & .list-item {
        @apply flex justify-between bg-white;
        padding: 15px;
        margin: 0 0 20px 0;
        border-radius: 10px;
        transition-duration: .2s;
        &:hover {
          background-color: rgba(255, 255, 255, 0.9);
        }
        & .img {
          width: 270px;
          height: 170px;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          overflow: hidden;
        }
        & .content {
          @apply flex flex-col justify-between;
          width: 685px;
          & .title {
            @apply font-bold;
            font-size: 20px;
          }
          & .detail {
            @apply flex justify-between items-end;
            & .tag-list {
              & span {
                color: #1F2C5D;
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
  .meta-deck-list {
    @apply bg-black;
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
  .meta-deck-list {
    & .article-container {
      @apply w-full;
      padding: 4vw 2.6vw;
      & .list-title {
        font-size: 20px;
      }
      & .list-container {
        margin: 4vw 0;
        & .list-item {
          @apply flex flex-col justify-between items-center w-full;
          padding: 4vw;
          margin: 0 0 4vw 0;
          & .img {
            width: 86vw;
            height: 54vw;
          }
          & .content {
            width: 86vw;
            & .title {
              font-size: 18px;
            }
            & .detail {
              @apply flex flex-col flex-col-reverse justify-between items-start;
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
