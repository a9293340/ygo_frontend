declare module 'common-types' {
  type CallBack<Params = any[], Res = any> = (...params: Params) => Res;

  type PaginationGetList = {
    limit: number;
    page: number;
  };
}

declare module 'axios-types' {
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
    | 'list'
    | 'add'
    | 'edit'
    | 'articleList'
    | 'deckList'
    | 'delete'
    | 'yuyuPrice'
    | 'verify'
    | 'resetPassword'
    | 'login';
}

declare module 'component-types' {
  interface MenuItem {
    title: string;
    link?: string;
    children?: MenuItemList;
    onlyPc?: boolean;
    checkLogin?: boolean;
  }

  interface Page {
    id: string;
    day?: number;
    week?: number;
    month: number;
    year: number;
    view: PageView;
    trimWeeks: boolean;
    position: number;
    row: number;
    rowFromEnd: number;
    column: number;
    columnFromEnd: number;
    showWeeknumbers: boolean;
    showIsoWeeknumbers: boolean;
    weeknumberPosition: string;
    monthTitle: string;
    weekTitle?: string;
    dayTitle?: string;
    title: string;
    titlePosition: TitlePosition;
    shortMonthLabel: string;
    monthLabel: string;
    shortYearLabel: string;
    yearLabel: string;
    monthComps: MonthParts;
    prevMonthComps: MonthParts;
    nextMonthComps: MonthParts;
    days: CalendarDay[];
    weeks: CalendarWeek[];
    weekdays: CalendarWeekday[];
    viewDays: CalendarDay[];
    viewWeeks: CalendarWeek[];
  }

  interface Todo {
    description?: string;
    isComplete?: boolean;
    dates?: Date[];
    color?: string;
  }

  type PageList = Page[];
  type MenuItemList = MenuItem[];

  interface CalendarProps {
    isDark: boolean;
    expanded: boolean;
    typeColor: string[];
  }

  type GridTickSet = {
    color: string;
    size: number;
    weight: string;
  };

  type Legends = {
    color: string;
    size: number;
    position: string;
  };

  type ToolTip = {
    color: string;
    titleSize: number;
    contentSize: number;
    bgc: string;
  };

  interface PriceChartProps {
    price: CardsPriceType[];
    colors: string[];
    yAxisSetSize: number;
    xAxisSetSize: number;
    width: string;
    height: string;
    yGrid: boolean;
    xGrid: boolean;
    xGridColor: string;
    yGridColor: string;
    xTickSet: GridTickSet;
    yTickSet: GridTickSet;
    legend: Legend;
    toolTip: ToolTip;
  }
}
