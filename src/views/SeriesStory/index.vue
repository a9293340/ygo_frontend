<template>
	<ArticleList :type="4" :title="`${t('menu.series_story')}`" />
</template>

<script setup lang="ts">
import i18n from "@/i18n/index";

const { t } = i18n.global;
</script>

<style lang="scss" scoped></style>
