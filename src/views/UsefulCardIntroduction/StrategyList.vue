<template>
	<ArticleList :type="2" :sub-type="1" :title="`${t('menu.strategy')}`" />
</template>

<script setup lang="ts">
import i18n from "@/i18n/index";

const { t } = i18n.global;
</script>

<style lang="scss" scoped></style>
