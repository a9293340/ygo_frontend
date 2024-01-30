<template>
	<ArticleList :type="6" :sub-type="3" :title="`${t('menu.production_information')} - ${t('menu.p_deck')}`" />
</template>

<script setup lang="ts">
import i18n from "@/i18n/index";

const { t } = i18n.global;</script>

<style lang="scss" scoped></style>
