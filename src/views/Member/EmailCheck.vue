<script setup lang="ts">
import * as CryptoJS from 'crypto-js';
const route = useRoute();
onMounted(() => {
  const id = (route.params.id as string).replace(/_/g, '/');
  const password = JSON.parse(
    CryptoJS.AES.decrypt(id, import.meta.env.VITE_ENCODEKEY).toString(CryptoJS.enc.Utf8),
  );

  console.log(password);
});
</script>

<template>
  <div>check email</div>
</template>

<style scoped></style>
