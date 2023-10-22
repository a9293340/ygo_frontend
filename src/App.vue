<template>
	<div class="app">
		<Navbar />
		<router-view />
		<Footer />
	</div>
</template>

<script setup lang="ts">
import { callApi } from "@/util/api";
import type { SearchArticleType } from "request-data-types";
import type { BaseArticleList, BannerList } from "module-types";
import type { NotHasTotalRes } from "response-data-types";
import { decode } from "@/util/index";

onMounted(async () => {
	const a = (
		await callApi<SearchArticleType>(
			{
				article_type: 0,
				article_subtype: null,
			},
			"search",
			"list",
			false
		)
	).data;
	const b = (await callApi<object>({}, "banner", "list", false)).data;
	console.log(decode<NotHasTotalRes<BaseArticleList>>(a).list.length);
	console.log(decode<NotHasTotalRes<BannerList>>(b).list.length);
});
</script>

<style lang="scss" scoped>
.app {
	@apply bg-black;
}
</style>
