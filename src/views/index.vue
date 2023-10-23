<template>
	<div class="index-wrapper">
		<Banner />
		<TopArticle
			:title="$t('menu.meta_deck')"
			:type="0"
			:router="'/meta_deck'"
		/>
		<TopArticle
			:title="$t('menu.series_introduction')"
			:type="1"
			:router="'/series_introduction/theme_deck'"
		/>
		<TopArticle
			:title="$t('menu.useful_card_introduction')"
			:type="2"
			:router="'/useful_card_introduction/single_card'"
		/>
	</div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.index-wrapper {
  padding: 0 0 30px;
}
</style>
