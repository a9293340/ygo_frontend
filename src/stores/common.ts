export const useCommon = defineStore('common', () => {
  const account_token = ref<string>('');

  return {
    account_token,
  };
});
