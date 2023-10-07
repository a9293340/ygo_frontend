<template>
  <div class="sideboard-wrapper">
    <el-menu
        active-text-color="#ffffff"
        background-color="#1F2C5D"
        class="el-menu-vertical-demo"
        text-color="#cecece"
    >
      <div v-for="(item, index) in menu" :key="index">
        <el-sub-menu v-if="item.children" :index="index">
          <template #title>{{ item.title }}</template>
          <el-menu-item
              v-for="(childItem, childIndex) in item.children"
              :key="childIndex"
              :index="`${index}-${childIndex}`"
              @click="routerGo(childItem.link)"
          >
            {{ childItem.title }}
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else :index="index" @click="routerGo(item.link)">
          <span>{{ item.title }}</span>
        </el-menu-item>
      </div>

    </el-menu>
  </div>
</template>

<script setup lang="ts">
import i18n from '/src/i18n/index'
import { useRouter } from 'vue-router'
const router = useRouter()

const menu:object[] = ref([
  { title: i18n.global.t('menu.home'), link: '/' },
  {
    title: i18n.global.t('menu.member'),
    children: [
      { title: i18n.global.t('menu.info'), link: '/member/info' },
      { title: i18n.global.t('menu.deck_list'), link: '/member/deck_list' },
    ]
  },
  { title: i18n.global.t('menu.meta_deck'), link: '/meta_deck' },
  {
    title: i18n.global.t('menu.series_introduction'),
    children: [
      { title: i18n.global.t('menu.theme_deck'), link: '/series_introduction/theme_deck' },
      { title: i18n.global.t('menu.plugin'), link: '/series_introduction/plugin' },
    ]
  },
  {
    title: i18n.global.t('menu.useful_card_introduction'),
    children: [
      { title: i18n.global.t('menu.single_card'), link: '/useful_card_introduction/single_card' },
      { title: i18n.global.t('menu.strategy'), link: '/useful_card_introduction/strategy' },
    ]
  },
  {
    title: i18n.global.t('menu.production_information'),
    children: [
      { title: i18n.global.t('menu.p_pack'), link: '/production_information/pack' },
      { title: i18n.global.t('menu.p_deck'), link: '/production_information/deck' },
      { title: i18n.global.t('menu.p_rd'), link: '/production_information/rd' },
      { title: i18n.global.t('menu.p_box'), link: '/production_information/box' },
      { title: i18n.global.t('menu.p_other'), link: '/production_information/other' },
    ]
  },
  {
    title: i18n.global.t('menu.rules'),
    children: [
      { title: i18n.global.t('menu.judgment'), link: '/rules/judgment' },
      { title: i18n.global.t('menu.ban_list'), link: '/rules/ban_list' },
    ]
  },
  { title: i18n.global.t('menu.series_story'), link: '/series_story' },
  { title: i18n.global.t('menu.cards'), link: '/cards' },
  { title: i18n.global.t('menu.deck'), link: '/deck' },
  { title: i18n.global.t('menu.calendar'), link: '/calendar' },
])

const routerGo:void = (routerLink:string) => {
  router.push(routerLink)
}
</script>

<style lang="scss" scoped>
.sideboard-wrapper {
  @apply fixed top-0 left-0 h-screen;
  width: 220px;
  padding: 70px 0 0 0;
  background-color: #1F2C5D;
  color: #cecece;
  & .paper-clip {
    font-size: 14px;
  }
  :deep(.el-menu) {
    border: none;
    padding: 0 20px;
  }
  :deep(.el-menu-item), :deep(.el-sub-menu__title) {
    font-size: 16px;
    padding: 0 0 0 5px !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  :deep(.el-menu--inline) {
    padding: 0 0 0 25px;
  }
}
</style>
