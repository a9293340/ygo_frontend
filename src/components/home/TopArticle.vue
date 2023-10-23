<template>
	<div class="top-article">
		<h2 class="list-title">{{ props.title }}</h2>
		<div class="list-container">
			<router-link
				:to="`${props.router}/${item._id}`"
				class="list-item"
				v-for="item in list"
				:key="item._id"
			>
				<div class="img" :style="`background-image: url(${item.photo})`"></div>
				<div class="content">
					<div class="title">{{ item.title }}</div>
					<div class="article-info">
						<div>{{ `${$t("article.author")}：${item.admin_name}` }}</div>
						<div>{{ `${$t("article.date")}：${item.publish_date}` }}</div>
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
import type { BaseArticleList } from "module-types";

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
	{
		_id: "abc1234569",
		title: "文章標題3333",
		publish_date: "2023/10/30",
		photo: "https://picsum.photos/450/300",
		content: "33333內容內容內容內容內容內容內容內容",
		status: 0,
		to_top: false,
		admin_name: "有錢倫2",
		admin_id: "admin_id12347",
		tag: ["主流3", "龍女僕"],
	},
]);

onMounted(() => {
	console.log(props.title);
	console.log(props.type);
});
</script>

<style lang="scss" scoped>
.top-article {
	width: 1000px;
	margin: 0 auto;
	padding: 0 0 24px;
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
				@apply w-full bg-no-repeat bg-cover;
				height: 201.48px;
			}
			& .content {
				padding: 10px 15px;
				& .title {
					@apply font-bold;
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
