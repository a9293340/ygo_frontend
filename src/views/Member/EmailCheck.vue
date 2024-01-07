<script setup lang="ts">
import { decode } from '@/util';
import type { VerifyType } from 'request-data-types';
import { callApi } from '@/util/api';
import { useRouter } from 'vue-router';
import i18n from '@/i18n';
const { t } = i18n.global;
const router = useRouter();
const route = useRoute();
onMounted(async () => {
  const id = decode(
    (route.params.id as string).replace(/_/g, '/')
  ) as VerifyType;

  const res = await callApi<{ verify_code: VerifyType }>(
    { verify_code: id },
    'member',
    'verify',
    false
  );

  !res.error_code
    ? alert(t('user.verify_good'))
    : alert(t(`user.verify_${res.error_code}`));
  router.push('/');
});
</script>

<template>
  <div class="check-mail">
    <span> Card Time Verify Page ... </span>
  </div>
</template>

<style lang="scss" scoped>
.check-mail {
  min-height: calc(100vh - 104px);
  span {
    @apply text-white font-extrabold text-8xl;
  }
}
</style>
