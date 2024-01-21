import Cookies from "js-cookie";

export const useCommon = defineStore('common', () => {
  const account_token = ref<string>(Cookies.get('card-time-frontend-token') || '');
  const account_id = ref<string>(Cookies.get('card-time-frontend-account') || '');
  const account_name = ref<string>(Cookies.get('card-time-frontend-name') || '');

  const setAccount = (token:string, account:string, name:string) => {
    Cookies.set('card-time-frontend-token', token, { expires: 3 });
    Cookies.set('card-time-frontend-account', account, {
      expires: 3,
    });
    Cookies.set('card-time-frontend-name', name, { expires: 3 });
    account_token.value = token;
    account_id.value = account;
    account_name.value = name;
  }
  const clearAccount = () => {
    Cookies.remove('card-time-frontend-token');
    Cookies.remove('card-time-frontend-account');
    Cookies.remove('card-time-frontend-name');
    account_token.value = '';
    account_id.value = '';
    account_name.value = '';
  }

  return {
    account_token,
    account_id,
    account_name,
    setAccount,
    clearAccount
  };
});
