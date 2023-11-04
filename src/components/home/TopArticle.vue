<template>
	<div class="top-article">
		<h2 class="list-title">{{ props.title }}</h2>
		<div class="list-container" v-if="list.length">
			<router-link
				:to="`${props.router}/${item._id}`"
				class="list-item"
				v-for="item in list"
				:key="item._id"
			>
				<div
					v-if="item.photo"
					class="img"
					:style="`background-image: url(/api/card-image/article/${item.photo})`"
				></div>
				<div class="content">
					<div class="title">{{ item.title }}</div>
					<div class="article-info">
						<div>{{ `${$t("article.author")}：${item.author_name}` }}</div>
						<div>{{ `${$t("article.date")}：${formatDateString(item.publish_date)}` }}</div>
					</div>
				</div>
			</router-link>
		</div>
		<router-link :to="props.router" class="more">
			<div>{{ $t("article.more") }}</div>
			<el-icon><ArrowRightBold /></el-icon>
		</router-link>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, defineProps } from "vue";
import type { BaseArticleList, NormalArticleList } from "module-types";
import type { SearchArticleType } from "request-data-types";
import type { NotHasTotalRes } from "response-data-types";

import { callApi } from "@/util/api";
import { formatDateString } from "@/util/parseDate";
import { decode } from "@/util";

const props = defineProps({
	title: {
		type: String,
		required: true,
	},
	type: {
		type: Number,
		required: true,
	},
	router: {
		type: String,
		required: true,
	},
});

const list = ref<[] | BaseArticleList | NormalArticleList>([]);

onMounted(async () => {
	const article = (
		await callApi<SearchArticleType>(
			{
				article_type: props.type,
				article_subtype: null,
				page: 0,
				limit: 3,
				status: 0,
			},
			"search",
			"list",
			false
		)
	).data;
	list.value =
		props.type === 0
			? decode<NotHasTotalRes<BaseArticleList>>(article).list
			: decode<NotHasTotalRes<NormalArticleList>>(article).list;
});
</script>

<style lang="scss" scoped>
.top-article {
	width: 1000px;
	margin: 0 auto;
	padding: 24px 0 0;
	& .list-title {
		@apply text-white inline-block;
		font-size: 24px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.5);
		padding: 0 5px;
	}
	& .list-container {
		@apply grid grid-cols-3 gap-5;
		margin: 20px 0;
		& .list-item {
			@apply bg-white overflow-hidden;
			border-radius: 10px;
			transition-duration: 0.2s;
			&:hover {
				background-color: rgba(255, 255, 255, 0.9);
			}
			& .img {
				@apply w-full bg-no-repeat bg-cover bg-center;
				height: 201.48px;
			}
			& .content {
				padding: 10px 15px;
				& .title {
					@apply font-bold;
					color: #333333;
					font-size: 20px;
					height: 62px;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
				& .article-info {
					color: #636363;
					font-size: 18px;
					margin: 10px 0 0 0;
				}
			}
		}
	}
	& .more {
		@apply flex justify-end items-center;
		color: #c9c9c9;
		font-size: 18px;
		transition-duration: 0.2s;
		&:hover {
			@apply text-white;
		}
	}
}

@media (max-width: 1050px) {
	.top-article {
		width: 740px;
		& .list-container {
			@apply grid grid-cols-3 gap-3;
			& .list-item {
				& .img {
					@apply w-full;
					height: 150.27px;
				}
				& .content {
					padding: 5px 10px;
					& .title {
						font-size: 18px;
						height: 54px;
					}
					& .article-info {
						font-size: 16px;
					}
				}
			}
		}
		& .more {
			font-size: 16px;
		}
	}
}

@media (max-width: 768px) {
	.top-article {
		@apply w-full;
		padding: 4vw;
		& .list-title {
			font-size: 20px;
		}
		& .list-container {
			@apply grid grid-cols-1 gap-4;
			margin: 4vw 0;
			& .list-item {
				& .img {
					@apply w-full;
					height: 57.92vw;
				}
				& .content {
					padding: 5px 10px;
					& .title {
						font-size: 18px;
						height: 54px;
					}
					& .article-info {
						font-size: 16px;
						margin: 1.3vw 0 0 0;
					}
				}
			}
		}
		& .more {
			font-size: 16px;
		}
	}
}
</style>
