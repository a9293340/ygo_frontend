declare module 'module-types' {
	interface CardsImage {
		_id?: string;
		photo: string;
		number: string;
	}

	interface Cards {
		id?: string;
		name: string;
		type: string;
		star: string;
		attribute: string;
		rarity: string[];
		atk: number | null;
		def: number | null;
		product_information_type: string;
		number: string;
		effect: string;
		price_info: {
			time: string;
			price_lowest: number;
			price_avg: number;
			ratity: string;
		}[];
		price_yuyu: {
			time: string;
			price: number;
			ratity: string;
		}[];
	}

	interface ProductInformationType {
		_id?: string;
		packType: string;
		subtype: string;
		maintype: 0;
		status: 0;
		name: string;
	}

	interface Deck {
		_id?: string;
		admin_id: 0;
		title: string;
		create_date: string;
		main_deck: DeckContent[];
		extra_deck: DeckContent[];
		side_deck: DeckContent[];
	}

	interface Admin {
		_id?: string;
		photo?: string;
		name: string;
		create_date: string;
		type: number;
		status: number;
		account: string;
		password: string;
		email: string;
	}

	interface BaseArticle {
		_id?: string;
		title: string;
		publish_date: string;
		photo?: string;
		content: string;
		status: number;
		to_top: boolean;
		admin_id: string;
		tag: [];
	}

	interface NormalArticle extends BaseArticle {
		type: number;
	}

	interface ProductInformation extends NormalArticle {
		product_information_type_id: string;
	}

	interface Calendar {
		_id?: string;
		title: string;
		date: string;
		url?: string;
		content?: string;
		type: 0;
	}

	interface Banner {
		_id?: string;
		title: string;
		subtitle?: string;
		date: string;
		photo_pc: string;
		photo_mobile: string;
		url?: string;
	}

	interface Tag {
		_id?: string;
		tag: string;
	}

	interface Permit {
		_id?: string;
		name: string;
		permission: string[];
		type: number;
	}

	interface Token {
		token: string;
		tokenReq: string;
		date: string;
	}

	type DeckContent = {
		card_id: 0;
		card_rarity: string;
	};

	type CardsImageList = CardsImage[];
	type CardsList = Cards[];
	type DeckList = Deck[];
	type CalendarList = Calendar[];
	type AdminList = Admin[];
	type NormalArticleList = NormalArticle[];
	type ProductInformationList = ProductInformation[];
	type BaseArticleList = BaseArticle[];
	type BannerList = Banner[];
	type ProductInformationTypeList = ProductInformationType[];
	type TagList = Tag[];
	type PermitList = Permit[];
	type TokenList = Token[];
}
