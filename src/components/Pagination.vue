<template>
  <div :class="{ 'page-hidden': props.hidden }" class="pagination-container">
    <el-pagination
      :page-count="Math.ceil(props.total / props.limit)"
      :pager-count="5"
      :page-size="props.limit"
      layout="total, prev, pager, next"
      :total="props.total"
      @current-change="handleCurrentChange"
      :current-page="props.page + 1"
      :small="browserWidth < 450"
    />
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const route = useRoute();
const props = defineProps({
  hidden: {
    type: Boolean,
    default: false,
  },
  total: {
    required: true,
    type: Number,
  },
  page: {
    type: Number,
    default: 1,
  },
  limit: {
    type: Number,
    default: 2,
  },
});
const emit = defineEmits(['update:page', 'update:limit', 'pagination']);
const handleCurrentChange = (val: number) => {
  router.replace({
    query: {
      page: `${val - 1}`,
      ...route.query,
    },
  });
  emit('pagination', { page: val - 1, limit: props.limit });
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const browserWidth = window.innerWidth;
</script>

<style lang="scss" scoped>
.page-hidden {
  display: none !important;
}
.pagination-container {
  @apply flex justify-center w-full;
  :deep(.el-pagination) {
    & button,
    .number,
    .more {
      @apply bg-transparent;
      color: rgba(211, 211, 211, 0.8);
    }
    & .is-active {
      @apply text-white;
    }
  }
}
</style>
