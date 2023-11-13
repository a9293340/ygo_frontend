<template>
  <ArticleList :type="5" :title="`${t('menu.battle_paper')}`" />
</template>

<script setup lang="ts">
import i18n from "@/i18n/index";

const { t } = i18n.global;
</script>

<style lang="scss" scoped></style>
