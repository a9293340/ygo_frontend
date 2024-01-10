<template>
  <div class="app">
    <Navbar />
    <router-view />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Cookies from 'js-cookie';
import { useCommon } from '@/stores/common';

const { account_token } = storeToRefs(useCommon());

onMounted(() => {
  account_token.value = Cookies.get('ygo-frontend-token');

  console.log(account_token.value);
});
</script>

<style lang="scss" scoped>
.app {
  @apply bg-black;
}
</style>
