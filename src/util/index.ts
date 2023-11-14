import * as CryptoJS from 'crypto-js';

const TokenKey = 'Front-Token';
const AccountKey = 'Ygo-Account-Front';

export const encode = <T extends object>(encodeValue: T) =>
  CryptoJS.AES.encrypt(JSON.stringify(encodeValue), import.meta.env.VITE_ENCODEKEY).toString();

export const decode = <T>(decodeValue: string): T =>
  JSON.parse(
    CryptoJS.AES.decrypt(decodeValue, import.meta.env.VITE_ENCODEKEY).toString(CryptoJS.enc.Utf8),
  ) as T;

export const getToken = () =>
  (typeof localStorage.getItem(TokenKey) === 'string'
    ? localStorage.getItem(TokenKey)
    : '') as string;

export const setToken = (token: string) => localStorage.setItem(TokenKey, token);

export const removeToken = () => localStorage.removeItem(TokenKey);

export const getAccount = () =>
  (typeof localStorage.getItem(AccountKey) === 'string'
    ? localStorage.getItem(AccountKey)
    : '') as string;

export const setAccount = (account: string) => localStorage.setItem(AccountKey, account);

export const removeAccount = () => localStorage.removeItem(AccountKey);

// 移除多層物件內的null及空字串項目
export const removeNullAndEmptyString = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    // 如果傳入的不是物件或是 null，直接返回該值
    return obj;
  }
  // 建立一個新物件或陣列來存放過濾後的項目
  const filteredObj = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    const value = obj[key];
    // 使用遞迴處理多層物件
    const filteredValue = removeNullAndEmptyString(value);
    // 檢查處理後的值是否為 null 或 ''，如果不是就加入新的物件或陣列中
    if (filteredValue !== null && filteredValue !== '') {
      // @ts-ignore
      filteredObj[key] = filteredValue;
    }
  }
  return filteredObj;
};

// 隨機生成id
export const generateRandomString = (length: number): string => {
  const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const symbols: string = '!@#%-=';
  const symbolsLimit: number = 2;
  let randomString: string = '';
  let symbolsCount: number = 0;

  for (let i: number = 0; i < length; i++) {
    const shouldInsertSymbol: boolean =
      symbolsCount < symbolsLimit && Math.random() < symbolsLimit / length;

    if (shouldInsertSymbol) {
      const randomSymbolIndex: number = Math.floor(Math.random() * symbols.length);
      randomString += symbols.charAt(randomSymbolIndex);
      symbolsCount++;
    } else {
      const randomIndex: number = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
  }

  return randomString;
};
