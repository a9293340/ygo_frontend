<template>
  <div class="calendar">
    <div class="calendar-title">
      <el-icon class="guide-icon"><Guide /></el-icon>
      <div class="label">{{ $t('calendar.title') }}</div>
    </div>
    <Calendar
        :is-dark="true"
        :type-color="['blue', 'red', 'green']"
        :expanded="false"
        @get:data="getTimeData"
    />
    <div class="list-container">
      <div v-if="originData.length > 0" class="list-item" v-for="item in originData" :key="item._id">
        <el-tag :type="item.type === 0 ? '' : (item.type === 1 ? 'danger' : 'warning')" style="font-size: 14px">
          {{ item.type === 0 ? $t('calendar.race') : (item.type === 1 ? $t('calendar.release_date') : $t('calendar.other_activity')) }}
        </el-tag>
        <div class="title">{{ `${item.title} (${formatMD(item.date)})` }}</div>
        <div class="content">{{ item.content }}</div>
      </div>
      <div v-else class="no-activity">{{ $t('calendar.no_activity') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CalendarList } from "module-types";
import { formatMD } from "@/util/parseDate";

const originData = ref<CalendarList | []>([]);
const getTimeData = (data: CalendarList | []) => {
  originData.value = data.reverse()
  console.log(originData.value)
};
</script>

<style lang="scss" scoped>
.calendar {
  @apply flex flex-col items-center;
  min-height: calc(100vh - 104px);
  max-width: 1000px;
  width: 90vw;
  margin: 0 auto;
  padding: 30px 0;
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
  & .list-container {
    @apply w-full;
    margin: 30px 0 0;
    & .list-item {
      @apply bg-white;
      margin: 0 0 20px;
      padding: 20px;
      border-radius: 10px;
      & .title {
        @apply font-bold;
        font-size: 20px;
        margin: 5px 0 0 5px;
      }
      & .content {
        padding: 5px 5px 0;
        border-top: 1px solid rgba(0, 0, 0, 0.2);
      }
    }
    & .no-activity {
      @apply text-center;
      color: lightgray;
      font-size: 18px;
    }
  }
}
</style>
