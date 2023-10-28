<template>
  <div :class="{'page-hidden':props.hidden}" class="pagination-container">
    <el-pagination
        :current-page.sync="currentPage"
        :page-size="10"
        layout="total, prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  hidden: {
    type: Boolean,
    default: false
  },
  total: {
    required: true,
    type: Number
  },
  page: {
    type: Number,
    default: 1
  }
})
const emit = defineEmits(['update:page', 'update:limit', 'pagination'])
const currentPage = computed({
  get() {
    return props.page
  },
  set(val) {
    emit('update:page', val)
  }
})
const handleCurrentChange = (val) => {
  emit('pagination', { page: val, limit: 10 })
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
</script>

<style lang="scss" scoped>
.page-hidden {
  display: none !important;
}
.pagination-container {
  @apply flex justify-center w-full;
  :deep(.el-pagination) {
    & button, .number, .more {
      @apply bg-transparent;
      color: lightgray;
    }
  }
}
</style>
