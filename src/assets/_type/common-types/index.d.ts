declare module 'common-types' {
	type CallBack<Params = any[], Res = any> = (...params: Params) => Res;
}
