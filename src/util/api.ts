import type { AxiosType, RequestObject, RequestMethodType } from 'axios-types';
import axios from 'axios';
import { encode } from '.';
import Cookies from 'js-cookie';

export const callApi = async <DataRequestType>(
  data: DataRequestType,
  database: string,
  method: RequestMethodType | null,
  hasToken?: boolean
): Promise<AxiosType> => {
  const tokenReq = Cookies.get('card-time-frontend-account');
  const token = Cookies.get('card-time-frontend-token');

  let requestObject: RequestObject<DataRequestType> = {
    ...data,
    token: hasToken ? token : 'frontend',
  };
  // console.log(requestObject)

  if (requestObject.token !== 'frontend') requestObject.tokenReq = tokenReq;

  return (
    await axios.post<AxiosType>(`/api/${database}/${method}`, {
      data: encode(requestObject),
    })
  ).data;
};
