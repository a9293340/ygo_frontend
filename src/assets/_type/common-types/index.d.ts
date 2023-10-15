declare module "common-types" {
	type CallBack<Params = any[], Res = any> = (...params: Params) => Res;
}

declare module "axios-types" {
	type AxiosType = {
		error_code: number;
		data: string;
	};

	type RequestObject<T> = {
		token: string;
		data?: T;
		tokenReq?: string;
	};

	type RequestMethodType =
		| "list"
		| "add"
		| "edit"
		| "articleList"
		| "deckList"
		| "delete"
		| "yuyuPrice";
}

declare module "component-types" {
	interface MenuItem {
		title: string
		link?: string
		children?: MenuItemList
	}

	type MenuItemList = MenuItem[]
}
