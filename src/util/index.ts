import * as CryptoJS from "crypto-js";

const TokenKey = "Front-Token";
const AccountKey = "Ygo-Account-Front";

export const encode = <T extends object>(encodeValue: T) =>
	CryptoJS.AES.encrypt(
		JSON.stringify(encodeValue),
		import.meta.env.VITE_ENCODEKEY
	).toString();

export const decode = <T>(decodeValue: string): T =>
	CryptoJS.AES.decrypt(decodeValue, import.meta.env.VITE_ENCODEKEY).toString(
		CryptoJS.enc.Utf8
	) as T;

export const getToken = () =>
	(typeof localStorage.getItem(TokenKey) === "string"
		? localStorage.getItem(TokenKey)
		: "") as string;

export const setToken = (token: string) =>
	localStorage.setItem(TokenKey, token);

export const removeToken = () => localStorage.removeItem(TokenKey);

export const getAccount = () =>
	(typeof localStorage.getItem(AccountKey) === "string"
		? localStorage.getItem(AccountKey)
		: "") as string;

export const setAccount = (account: string) =>
	localStorage.setItem(AccountKey, account);

export const removeAccount = () => localStorage.removeItem(AccountKey);
