declare module 'common-types' {
  type CallBack<Params = any[], Res = any> = (...params: Params) => Res;

  type AxiosType = {
    error_code: number;
    data: string;
  };
}
