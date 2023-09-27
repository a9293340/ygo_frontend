import * as CryptoJS from 'crypto-js';

export const encode = <T extends object>(encodeValue: T) =>
  CryptoJS.AES.encrypt(JSON.stringify(encodeValue), import.meta.env.VITE_ENCODEKEY).toString();

export const decode = <T>(decodeValue: string): T =>
  CryptoJS.AES.decrypt(decodeValue, import.meta.env.VITE_ENCODEKEY).toString(
    CryptoJS.enc.Utf8,
  ) as T;
