type DeckContent = {
  card_id: 0;
  card_rarity: string;
};

type CardsPriceType = {
  time: string;
  price_lowest: number;
  price_avg: number;
  rarity: string;
};

type CardsPriceYuYuType = {
  time: string;
  price: number;
  rarity: string;
};

type FindCardsInfoType = {
  id?: string;
  number?: string;
  name?: string;
  type?: string;
  star?: string;
  attribute?: string;
  race?: string;
  rarity?: string;
  atk_t?: number;
  atk_l?: number;
  def_t?: number;
  def_l?: number;
  product_information_type?: string;
};

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
    price_info: CardsPriceType[];
    price_yuyu: CardsPriceYuYuType[];
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
    last_edit_date: string;
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

  type Tag = {
    _id: string;
    tag: string;
  };

  interface BaseArticle {
    _id?: string;
    title: string;
    publish_date: string;
    photo?: string;
    content: string;
    status: number;
    to_top: boolean;
    admin_id: string;
    author_name: string;
    tag: Tag[];
  }

  interface NormalArticle extends BaseArticle {
    type: number;
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

  type CardsImageList = CardsImage[];
  type CardsList = Cards[];
  type DeckList = Deck[];
  type CalendarList = Calendar[];
  type AdminList = Admin[];
  type NormalArticleList = NormalArticle[];
  type BaseArticleList = BaseArticle[];
  type BannerList = Banner[];
  type ProductInformationTypeList = ProductInformationType[];
  type TagList = Tag[];
  type PermitList = Permit[];
  type TokenList = Token[];
}
declare module 'request-data-types' {
  type LoginType = {
    account: string;
    password: string;
  };

  type ResetPWDType = {
    old_password: string;
    new_password: string;
  };

  type VerifyType = {
    verify_code: string;
  };

  type MemberAddType = {
    name: string;
    email: string;
    create_date: string;
    account: string;
    password: string;
  };

  type MemberEditType = {
    _id: string;
    name: string;
    photo: string;
    email: string;
  };

  type ArticleListType = {
    page: number;
    limit: number;
    filter: {
      _id: string;
    };
  };

  type CalendarListType = {
    filter: {
      date?: string;
      type?: number;
    };
  };

  type SearchArticleType = {
    page: number;
    limit: number;
    title?: string;
    article_type: number;
    article_subtype: number | null;
    status: 0;
    to_top?: boolean;
  };

  type CardListType = {
    page: number;
    limit: number;
    filter: FindCardsInfoType;
  };

  type CardEditType = {
    number?: string;
    name?: string;
    type?: string;
    star?: string;
    attribute?: string;
    rarity?: string[];
    atk?: number;
    def?: number;
    product_information_type?: string;
    id?: number;
    effect?: string;
    time?: string;
    price_info?: CardsPriceType[];
    price_yuyu?: CardsPriceYuYuType[];
  };

  type DeckListType = {
    page: number;
    limit: number;
    filter: {
      _id?: string;
      admin_id?: string;
      title?: string;
      begin_date?: string;
      end_date?: string;
    };
  };

  type DeckAddAndEditType = {
    _id?: string;
    title: string;
    create_date: string;
    last_edit_date: string;
    admin_id: string;
    main_deck: DeckContent[];
    extra_deck: DeckContent[];
    side_deck: DeckContent[];
  };

  type DeckDeleteType = {
    _id: string;
  };
}

declare module 'response-data-types' {
  interface NotHasTotalRes<T> {
    list: T;
  }

  interface HasTotalRes<T> extends NotHasTotalRes<T> {
    total: number;
  }
}
