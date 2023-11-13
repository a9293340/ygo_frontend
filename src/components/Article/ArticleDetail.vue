<template>
	<div class="meta-deck-detail">
		<div class="article-container">
			<img
				class="top-img"
				:src="`/api/card-image/article/${article.photo}`"
				alt=""
			/>
			<h1>{{ article.title }}</h1>
			<div class="info">
				<div>{{ `${t("article.author")}：${article.author_name}` }}</div>
				<div>
					{{
						`${t("article.date")}：${formatDateString(article.publish_date)}`
					}}
				</div>
			</div>
			<div class="content" v-html="article.content"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { BaseArticle, NormalArticle } from "module-types";
import type { ArticleListType } from "request-data-types";
import type { BaseArticleList, NormalArticleList } from "module-types";
import type { HasTotalRes } from "response-data-types";
import { callApi } from "@/util/api";
import { decode } from "@/util";
import { onMounted } from "vue";
import { useRoute } from "vue-router";

import { formatDateString } from "@/util/parseDate";
import i18n from "@/i18n/index";

const { t } = i18n.global;

const props = defineProps({
	path: {
		type: String,
		default: "metaDeck",
	},
});

const route = useRoute();

const article = ref<BaseArticle | NormalArticle>({
	_id: "643c135f6d9a4b14a77be3aa",
	title: "3/4-3/12 賽事上位卡表參考區",
	publish_date: "2023-10-31T15:17:24.000Z",
	photo: "43abc84b-1dbb-4fad-b0c2-4cee17312e60.webp",
	content:
		"<p style='color:red;'><strong>3/4-3/12 上位卡表抄牌區</strong></p><p><strong>4月禁卡表被劍神官洗回去，只好繼續抄本週環境的牌</strong></p><p><strong>本週的60張魔救表現不錯</strong></p>",
	status: 0,
	to_top: true,
	admin_id: "6419c838d4b5d905bb2c9aaf",
	author_name: "王子恆2",
	tag: [],
});

onMounted(async () => {
	try {
		article.value = decode<HasTotalRes<BaseArticleList | NormalArticleList>>(
			(
				await callApi<ArticleListType>(
					{ page: 0, limit: 1, filter: { _id: route.params.id as string } },
					props.path,
					"articleList",
					false
				)
			).data
		).list[0];
	} catch (error) {
		console.log("Get Api Error");
	}
});
</script>

<style lang="scss" scoped>
.meta-deck-detail {
	min-height: calc(100vh - 104px);
	& .article-container {
		@apply flex flex-col;
		width: 1000px;
		margin: 0 auto;
		& .top-img {
			margin: 20px 0;
		}
		& h1 {
			@apply w-full font-bold text-white;
			font-size: 30px;
		}
		& .info {
			@apply w-full flex justify-end items-center text-white;
			font-size: 18px;
			div {
				margin: 0 10px;
			}
		}
		& .content {
			@apply w-full text-justify;
			font-size: 18px;
			margin: 20px 0 50px;
			padding: 20px;
			border-radius: 10px;
			background-color: rgba(255, 255, 255, 0.9);
		}
	}
}

@media (max-width: 1050px) {
	.meta-deck-detail {
		& .article-container {
			width: 740px;
			& .top-img {
				margin: 20px 0;
			}
			& h1 {
				font-size: 28px;
			}
		}
	}
}

@media (max-width: 768px) {
	.meta-deck-detail {
		min-height: calc(100vh - 101px);
		& .article-container {
			@apply w-full;
			& .top-img {
				margin: 0 0 2.6vw;
			}
			& h1 {
				font-size: 24px;
				padding: 0 5px 5px 10px;
			}
			& .info {
				@apply w-full flex flex-col justify-end items-end text-white;
				font-size: 16px;
				div {
					margin: 0 10px;
				}
			}
			& .content {
				width: calc(100vw - 20px);
				font-size: 18px;
				margin: 10px auto 50px;
				padding: 10px;
				border-radius: 5px;
			}
		}
	}
}
</style>
