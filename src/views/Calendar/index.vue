<template>
  <div class="calendar">
    <Calendar
        :is-dark="true"
        :type-color="['blue', 'red', 'green']"
        :expanded="false"
        @get:data="getTimeData"
    />
  </div>
</template>

<script setup lang="ts">
import type { CalendarList } from "module-types";
import { formatDateString } from "@/util/parseDate";

const originData = ref<CalendarList | []>([]);
const getTimeData = (data: CalendarList | []) => {
  originData.value = data.reverse()
};
</script>

<style lang="scss" scoped>
.calendar {
  min-height: calc(100vh - 104px);
}
</style>
