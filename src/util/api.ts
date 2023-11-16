import type { AxiosType, RequestObject, RequestMethodType } from "axios-types";
import type { ResetPWDType, LoginType, VerifyType } from "request-data-types";
import axios from "axios";
import { getAccount, getToken, encode } from ".";

export const callApi = async <DataRequestType>(
	data: DataRequestType,
	database: string,
	method: RequestMethodType | null,
	hasToken?: boolean
): Promise<AxiosType> => {
	const tokenReq = getAccount();
	const token = getToken();

	let requestObject: RequestObject<DataRequestType> = {
		...data,
		token: hasToken ? token : "frontend",
	};
	// console.log(requestObject)

	if (requestObject.token !== "frontend") requestObject.tokenReq = tokenReq;

	return (
		await axios.post<AxiosType>(`/api/${database}/${method}`, {
			data: encode(requestObject),
		})
	).data;
};

export const login = async (data: LoginType) =>
	(await axios.post<AxiosType>("/api/member/login", data)).data;

export const logout = async () =>
	(
		await axios.post<AxiosType>("/api/member/logout", {
			token: getToken(),
			tokenReq: getAccount(),
		})
	).data;

export const resetPWD = async (data: ResetPWDType) =>
	(
		await axios.post<AxiosType>("/api/member/resetPassword", {
			token: getToken(),
			tokenReq: getAccount(),
			...data,
		})
	).data;

export const verifyApi = async (data: VerifyType) =>
	(
		await axios.post<AxiosType>("/api/member/resetPassword", {
			data,
		})
	).data;
