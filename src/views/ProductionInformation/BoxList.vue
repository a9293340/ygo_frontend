<template>
	<ArticleList :type="6" :sub-type="4" :title="`${t('menu.production_information')} - ${t('menu.p_box')}`" />
</template>

<script setup lang="ts">
import i18n from "@/i18n/index";

const { t } = i18n.global;
</script>

<style lang="scss" scoped></style>
