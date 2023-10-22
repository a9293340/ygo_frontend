<template>
  <div class="index-wrapper">
    <Banner/>
    <TopArticle
      :title="$t('menu.meta_deck')"
      :type="0"
      :router="'/meta_deck'"
    />
    <TopArticle
        :title="$t('menu.series_introduction')"
        :type="1"
        :router="'/series_introduction'"
    />
    <TopArticle
        :title="$t('menu.useful_card_introduction')"
        :type="2"
        :router="'/useful_card_introduction'"
    />
  </div>
</template>

<script setup lang="ts">
import Banner from '/src/components/home/Banner.vue'
import TopArticle from '/src/components/home/TopArticle.vue'

</script>

<style lang="scss" scoped>
.index-wrapper {
}
</style>
