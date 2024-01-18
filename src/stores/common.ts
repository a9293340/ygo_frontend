export const useCommon = defineStore('common', () => {
  const account_token = ref<string>('');
  const account_id = ref<string>('');

  return {
    account_token,
    account_id,
  };
});
