<template>
	<div class="sideboard-wrapper scroll">
		<el-menu
			active-text-color="#ffffff"
			background-color="#1F2C5D"
			class="el-menu-vertical-demo"
			text-color="#cecece"
		>
			<div v-for="(item, index) in menu" :key="index">
				<el-sub-menu v-if="item.children" :index="`${index}}`">
					<template #title>{{ item.title }}</template>
					<el-menu-item
						v-for="(childItem, childIndex) in item.children"
						:key="childIndex"
						:index="`${index}-${childIndex}`"
						@click="routerGo(childItem.link)"
						:class="[
							{
								'is-rwd': childItem.check,
							},
						]"
					>
						{{ childItem.title }}
					</el-menu-item>
				</el-sub-menu>
				<el-menu-item v-else :index="`${index}}`" @click="routerGo(item.link)">
					<span>{{ item.title }}</span>
				</el-menu-item>
			</div>
		</el-menu>
	</div>
</template>

<script setup lang="ts">
// import { defineEmits } from 'vue';
import i18n from "@/i18n/index";
import { useRouter } from "vue-router";
import type { MenuItem } from "component-types";

const { t } = i18n.global;
const router = useRouter();

const menu = ref<MenuItem[]>([
  // 首頁
	{ title: t("menu.home"), link: "/" },
	// {
	// 	title: t("menu.member"),
	// 	children: [
	// 		{ title: t("menu.info"), link: "/member/info" },
	// 		{ title: t("menu.deck_list"), link: "/member/deck_list" },
	// 	],
	// },
  // 卡片查詢
  { title: t("menu.cards"), link: "/cards" },
  // 上位卡表
	{ title: t("menu.meta_deck"), link: "/meta_deck" },
  // 系列介紹
	// {
	// 	title: t("menu.series_introduction"),
	// 	children: [
	// 		{ title: t("menu.theme_deck"), link: "/serial_introduction/theme_deck" },
	// 		{ title: t("menu.plugin"), link: "/serial_introduction/plugin" },
	// 	],
	// },
  // 汎用卡介紹
	// {
	// 	title: t("menu.useful_card_introduction"),
	// 	children: [
	// 		{
	// 			title: t("menu.single_card"),
	// 			link: "/useful_card_introduction/single_card",
	// 		},
	// 		{ title: t("menu.strategy"), link: "/useful_card_introduction/strategy" },
	// 	],
	// },
  // 卡表介紹
	{
		title: t("menu.production_information"),
		children: [
			{ title: t("menu.p_pack"), link: "/product_information/pack" },
			{ title: t("menu.p_deck"), link: "/product_information/deck" },
			{ title: t("menu.p_rd"), link: "/product_information/rd" },
			{ title: t("menu.p_box"), link: "/product_information/box" },
			{ title: t("menu.p_other"), link: "/product_information/other" },
		],
	},
  // 規則相關
	{
		title: t("menu.rules"),
		children: [
			{ title: t("menu.judgment"), link: "/rules/judgment" },
			{ title: t("menu.ban_list"), link: "/rules/ban_list" },
		],
	},
  // 卡片故事
	// { title: t("menu.series_story"), link: "/series_story" },
  // 組牌
	{
		title: t("menu.deck"),
		children: [
			{ title: t("menu.deck_add"), link: "/deck/add", check: true },
			{ title: t("menu.deck_list"), link: "/deck" },
		],
	},
  // 日曆
	{ title: t("menu.calendar"), link: "/calendar" },
]);

const routerGo = (routerLink: string | undefined) => {
	if (typeof routerLink === "string") router.push(routerLink);
	closeSideboard();
};
const emit = defineEmits(["closeSideboard"]);
const closeSideboard = () => {
	emit("closeSideboard");
};
</script>

<style lang="scss" scoped>
.sideboard-wrapper {
	@apply fixed top-0 left-0 z-20;
	width: 220px;
	height: 100svh;
	padding: 70px 0 30px;
	background-color: #1f2c5d;
	color: #cecece;
	& .paper-clip {
		font-size: 14px;
	}
	:deep(.el-menu) {
		border: none;
		padding: 0 20px;
	}
	:deep(.el-menu-item),
	:deep(.el-sub-menu__title) {
		font-size: 16px;
		padding: 0 0 0 5px !important;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}
	:deep(.el-menu--inline) {
		padding: 0 0 0 25px;
	}
}

@media (max-width: 768px) {
	.sideboard-wrapper {
		@apply w-full;
	}
	.is-rwd {
		display: none;
	}
}
</style>
