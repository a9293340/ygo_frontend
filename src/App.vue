<template>
  <div class="app">
    <Navbar />
    <router-view />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { useCommon } from '@/stores/common';
const commonStore = useCommon()

onMounted(() => {
  console.log(commonStore.account_token);
  console.log(commonStore.account_id);
});
</script>

<style lang="scss" scoped>
.app {
  @apply bg-black;
}
</style>
