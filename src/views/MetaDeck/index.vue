<template>
	<div class="meta-deck-list">
		<div class="article-container">
      <div class="title-box">
        <h1 class="list-title">{{ $t("menu.meta_deck") }}</h1>
        <div class="search">
          <input v-model="listQuery.title" type="text" placeholder="Search...">
          <el-icon class="search-icon" @click="getList"><Search /></el-icon>
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
						:style="`background-image: url(${item.photo})`"
					></div>
					<div class="content">
						<div class="title">{{ item.title }}</div>
						<div class="detail">
							<div class="tag-list">
								<span v-for="(tagItem, tagIndex) in item.tag" :key="tagIndex">{{
									`#${tagItem}`
								}}</span>
							</div>
							<div class="article-info">
								<div>{{ `${$t("article.author")}：${item.admin_name}` }}</div>
								<div>{{ `${$t("article.date")}：${item.publish_date}` }}</div>
							</div>
						</div>
					</div>
				</router-link>
			</div>

      <Pagination
          :hidden="total <= 0"
          :total="total"
          :page.sync="listQuery.page"
          @pagination="getList"
      />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { BaseArticleList } from "module-types";
import type { SearchArticleType } from "request-data-types";

// 搜尋
const listQuery = ref<SearchArticleType>({
  page: 2,
  limit: 10,
  title: '',
  article_type: 0,
  article_subtype: null
})
const list = ref<BaseArticleList>([
	{
		_id: "abc1234567",
		title: "[基礎介紹] 閃刀姬牌組介紹 (閃刀/閃刀姫/Sky Striker)",
		publish_date: "2023/10/18",
		photo: "https://picsum.photos/300/200",
		content: "11111內容內容內容內容內容內容內容內容",
		status: 0,
		to_top: true,
		admin_name: "寶可夢大師-康哥",
		admin_id: "admin_id12345",
		tag: ["主流"],
	},
	{
		_id: "abc1234568",
		title: "文章標題2222",
		publish_date: "2023/10/22",
		photo: "https://picsum.photos/600/400",
		content: "222222內容內容內容內容內容內容內容內容",
		status: 0,
		to_top: false,
		admin_name: "有錢倫",
		admin_id: "admin_id12346",
		tag: ["主流2", "閃刀姬"],
	},
]);
const total = ref<Number>(2)
const getList = (val) => {
  listQuery.value.page = val.page
  console.log(listQuery.value)
}
</script>

<style lang="scss" scoped>
.meta-deck-list {
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
	.meta-deck-list {
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
