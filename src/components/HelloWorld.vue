<script setup lang="ts">
import { useCounterStore } from '@/stores/counter';
import type { CardsImage, CardsImageList } from 'module-types';

defineProps<{
  msg: string;
}>();
const { locale } = useI18n();
const { count, doubleCount } = storeToRefs(useCounterStore());
const { addCount } = useCounterStore();

const a = async (cards: CardsImageList): Promise<CardsImage> => {
  console.log(cards.find(el => el.number));
  return cards[0];
};
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3 class="text-6xl text-green-600 font-bold underline">
      You’ve successfully created a project with Vite+ Vue 3.
      {{ $t('test.title') }}
    </h3>
    <div>
      切換語言：
      <select v-model="locale" class="tw-select">
        <option value="zh-TW">中文</option>
        <option value="en-US">English</option>
      </select>
    </div>
    <h4 class="text-red-400">{{ count }} : {{ doubleCount }}</h4>
    <button class="btn-blue" @click="addCount">Click</button>
    <el-icon size="32">
      <Watermelon />
    </el-icon>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}
.btn-blue {
  @apply bg-blue-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded;
}

.tw-select {
  @apply block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
