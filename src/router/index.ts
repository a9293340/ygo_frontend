import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: () => import("../views/index.vue"),
		},
		// 會員中心
		// {
		// 	path: "/member",
		// 	name: "member",
		// 	redirect: "/member/info",
		// 	children: [
		// 		{
		// 			path: "info",
		// 			name: "info",
		// 			component: () => import("../views/Member/Info.vue"),
		// 		},
		// 		{
		// 			path: "deck_list",
		// 			name: "deck_list",
		// 			component: () => import("../views/Member/DeckList.vue"),
		// 		},
		// 		{
		// 			path: "deck_list/add",
		// 			name: "deck_add",
		// 			component: () => import("../views/Member/DeckAdd.vue"),
		// 		},
		// 		{
		// 			path: "deck_list/:id",
		// 			name: "deck_detail",
		// 			component: () => import("../views/Member/DeckDetail.vue"),
		// 		},
		// 	],
		// },
		// 上位卡表
		{
			path: "/meta_deck",
			name: "meta_deck",
			component: () => import("../views/MetaDeck/index.vue"),
		},
		{
			path: "/meta_deck/:id",
			name: "meta_deck_detail",
			component: () => import("../views/MetaDeck/Detail.vue"),
		},
		// 戰報
		{
			path: "/battle_paper",
			name: "battle_paper",
			component: () => import("../views/BattlePaper/index.vue"),
		},
		{
			path: "/battle_paper/:id",
			name: "battle_paper_detail",
			component: () => import("../views/BattlePaper/Detail.vue"),
		},
		// 系列介紹
		{
			path: "/series_introduction",
			name: "series_introduction",
			redirect: "/series_introduction/theme_deck",
			children: [
				{
					path: "theme_deck",
					name: "theme_deck",
					component: () =>
						import("../views/SeriesIntroduction/ThemeDeckList.vue"),
				},
				{
					path: "theme_deck/:id",
					name: "theme_deck_detail",
					component: () =>
						import("../views/SeriesIntroduction/ThemeDeckDetail.vue"),
				},
				{
					path: "plugin",
					name: "plugin",
					component: () => import("../views/SeriesIntroduction/PluginList.vue"),
				},
				{
					path: "plugin/:id",
					name: "plugin_detail",
					component: () =>
						import("../views/SeriesIntroduction/PluginDetail.vue"),
				},
			],
		},
		// 泛用卡介紹
		{
			path: "/useful_card_introduction",
			name: "useful_card_introduction",
			redirect: "/useful_card_introduction/single_card",
			children: [
				{
					path: "single_card",
					name: "single_card",
					component: () =>
						import("../views/UsefulCardIntroduction/SingleCardList.vue"),
				},
				{
					path: "single_card/:id",
					name: "single_card_detail",
					component: () =>
						import("../views/UsefulCardIntroduction/SingleCardDetail.vue"),
				},
				{
					path: "strategy",
					name: "strategy",
					component: () =>
						import("../views/UsefulCardIntroduction/StrategyList.vue"),
				},
				{
					path: "strategy/:id",
					name: "strategy_detail",
					component: () =>
						import("../views/UsefulCardIntroduction/StrategyDetail.vue"),
				},
			],
		},
		// 卡表介紹
		{
			path: "/production_information",
			name: "production_information",
			redirect: "/production_information/pack",
			children: [
				{
					path: "pack",
					name: "pack",
					component: () =>
						import("../views/ProductionInformation/PackList.vue"),
				},
				{
					path: "pack/:id",
					name: "pack_detail",
					component: () =>
						import("../views/ProductionInformation/PackDetail.vue"),
				},
				{
					path: "deck",
					name: "deck",
					component: () =>
						import("../views/ProductionInformation/DeckList.vue"),
				},
				{
					path: "deck/:id",
					name: "deck_detail",
					component: () =>
						import("../views/ProductionInformation/DeckDetail.vue"),
				},
				{
					path: "rd",
					name: "rd",
					component: () => import("../views/ProductionInformation/RdList.vue"),
				},
				{
					path: "rd/:id",
					name: "rd_detail",
					component: () =>
						import("../views/ProductionInformation/RdDetail.vue"),
				},
				{
					path: "box",
					name: "box",
					component: () => import("../views/ProductionInformation/BoxList.vue"),
				},
				{
					path: "box/:id",
					name: "box_detail",
					component: () =>
						import("../views/ProductionInformation/BoxDetail.vue"),
				},
				{
					path: "other",
					name: "other",
					component: () =>
						import("../views/ProductionInformation/OtherList.vue"),
				},
				{
					path: "other/:id",
					name: "other_detail",
					component: () =>
						import("../views/ProductionInformation/OtherDetail.vue"),
				},
			],
		},
		// 規則相關
		{
			path: "/rules",
			name: "rules",
			redirect: "/rules/judgment",
			children: [
				{
					path: "judgment",
					name: "judgment",
					component: () => import("../views/Rules/JudgementList.vue"),
				},
				{
					path: "judgment/:id",
					name: "judgment_detail",
					component: () => import("../views/Rules/JudgementDetail.vue"),
				},
				{
					path: "ban_list",
					name: "ban_list",
					component: () => import("../views/Rules/BanListList.vue"),
				},
				{
					path: "ban_list/:id",
					name: "ban_list_detail",
					component: () => import("../views/Rules/BanListDetail.vue"),
				},
			],
		},
		// 卡片故事
		{
			path: "/series_story",
			name: "series_story",
			component: () => import("../views/SeriesStory/index.vue"),
		},
		{
			path: "/series_story/:id",
			name: "series_story_detail",
			component: () => import("../views/SeriesStory/Detail.vue"),
		},
		// 卡片查詢
		{
			path: "/cards",
			name: "cards",
			component: () => import("../views/Cards/index.vue"),
		},
		{
			path: "/cards/:id",
			name: "cards_detail",
			component: () => import("../views/Cards/Detail.vue"),
		},
		// 組牌
		{
			path: "/deck",
			name: "deck",
			redirect: "/deck",
			children: [
				{
					path: "/deck",
					name: "deck_list",
					component: () => import("../views/Deck/index.vue"),
				},
				{
					path: "/:id",
					name: "deck_detail",
					component: () => import("../views/Deck/Detail.vue"),
				},
				{
					path: "/deck/add",
					name: "deck_add",
					component: () => import("../views/Deck/Add.vue"),
				},
			],
		},
		{
			path: "/deck/:id",
			name: "deck_detail",
			component: () => import("../views/Deck/Detail.vue"),
		},
		// 日曆
		{
			path: "/calendar",
			name: "calendar",
			component: () => import("../views/Calendar/index.vue"),
		},
	],
	scrollBehavior(to, from, savedPosition) {
		// always scroll to top
		return { top: 0 };
	},
});

export default router;
