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

const { account_token, account_id } = storeToRefs(useCommon());

onMounted(() => {
  account_token.value = Cookies.get('card-time-frontend-token');
  account_id.value = Cookies.get('card-time-frontend-account');

  console.log(account_token.value);
});
</script>

<style lang="scss" scoped>
.app {
  @apply bg-black;
}
</style>
