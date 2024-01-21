<template>
  <div class="app">
    <Navbar />
    <router-view />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { useCommon } from '@/stores/common';
import { callApi } from './util/api';

const { account_token } = storeToRefs(useCommon());
const { clearAccount } = useCommon();

onMounted(async () => {
  if (account_token.value) {
    const res = (
      await callApi<{ token: string }>(
        { token: account_token.value },
        'checkToken',
        'list',
        true
      )
    ).error_code;
    if (res) clearAccount();
  }
});
</script>

<style lang="scss" scoped>
.app {
  @apply bg-black;
}
</style>
