import type { AxiosType } from 'common-types';
import axios from 'axios';

export const axios_post_list = async <DataRequestType>(
  data: DataRequestType,
  database: string,
): Promise<AxiosType> => (await axios.post<AxiosType>(`/api/${database}/list`, { data })).data;
