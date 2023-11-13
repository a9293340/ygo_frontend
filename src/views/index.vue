<template>
	<div class="index-wrapper">
		<Banner />
    <div class="content-container">
      <div class="top-article">
        <TopArticle
            :title="t('menu.meta_deck')"
            :type="0"
            :router="'/meta_deck'"
        />
        <TopArticle
            :title="t('menu.series_introduction')"
            :type="1"
            :router="'/series_introduction/theme_deck'"
        />
        <TopArticle
            :title="t('menu.useful_card_introduction')"
            :type="2"
            :router="'/useful_card_introduction/single_card'"
        />
      </div>
      <div class="calendar">
        <div class="calendar-title">
          <el-icon class="guide-icon"><Guide /></el-icon>
          <div class="label">{{ t('calendar.title') }}</div>
        </div>
        <Calendar
            :is-dark="true"
            :type-color="['blue', 'red', 'green']"
            :expanded="false"
            @get:data="getTimeData"
        />
      </div>
    </div>
	</div>
</template>

<script setup lang="ts">
import type { CalendarList } from "module-types";
import i18n from "@/i18n/index";

const { t } = i18n.global;

const originData = ref<CalendarList | []>([]);
const getTimeData = (data: CalendarList | []) => {
  originData.value = data.reverse()
};
</script>

<style lang="scss" scoped>
.index-wrapper {
	padding: 0 0 30px;
  & .content-container {
    @apply flex justify-center;
    & .calendar {
      @apply text-center;
      margin: 70px 0 0 50px;
      & .calendar-title {
        @apply flex items-center justify-center font-bold;
        color: lightgray;
        margin: 0 0 10px;
        & .guide-icon {
          font-size: 24px;
        }
        & .label {
          font-size: 20px;
          margin: 0 5px;
        }
      }
    }
  }
}

@media (max-width: 1350px) {
  .index-wrapper {
    & .content-container {
      & .calendar {
        margin: 40px 0 0 30px;
      }
    }
  }
}

@media (max-width: 1050px) {
  .index-wrapper {
    & .content-container {
      @apply flex flex-col justify-center;
      & .calendar {
        margin: 20px 0 0 0;
      }
    }
  }
}
</style>
