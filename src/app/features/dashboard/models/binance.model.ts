export interface BinanceTradeDTO {
  readonly s: string; // Symbol
  readonly p: string; // Price
  readonly P: string; // Price change percentage
}

export interface ResponsePriceCTO {
  symbol: string;
  price: string;
}

export interface ResponseExchangeInfo {
  timezone: string;
  serverTime: number;
  rateLimits: RateLimit[];
  exchangeFilters: any[];
  symbols: Symbol[];
}

export interface RateLimit {
  rateLimitType: string;
  interval: string;
  intervalNum: number;
  limit: number;
}

export interface Symbol {
  symbol: string;
  status: Status;
  baseAsset: string;
  baseAssetPrecision: number;
  quoteAsset: QuoteAsset;
  quotePrecision: number;
  quoteAssetPrecision: number;
  baseCommissionPrecision: number;
  quoteCommissionPrecision: number;
  orderTypes: OrderType[];
  icebergAllowed: boolean;
  ocoAllowed: boolean;
  otoAllowed: boolean;
  opoAllowed: boolean;
  quoteOrderQtyMarketAllowed: boolean;
  allowTrailingStop: boolean;
  cancelReplaceAllowed: boolean;
  amendAllowed: boolean;
  pegInstructionsAllowed: boolean;
  isSpotTradingAllowed: boolean;
  isMarginTradingAllowed: boolean;
  filters: Filter[];
  permissions: any[];
  permissionSets: Array<PermissionSet[]>;
  defaultSelfTradePreventionMode: SelfTradePreventionMode;
  allowedSelfTradePreventionModes: SelfTradePreventionMode[];
}

export enum SelfTradePreventionMode {
  Decrement = 'DECREMENT',
  ExpireBoth = 'EXPIRE_BOTH',
  ExpireMaker = 'EXPIRE_MAKER',
  ExpireTaker = 'EXPIRE_TAKER',
}

export interface Filter {
  filterType: FilterType;
  minPrice?: string;
  maxPrice?: string;
  tickSize?: string;
  minQty?: string;
  maxQty?: string;
  stepSize?: string;
  limit?: number;
  minTrailingAboveDelta?: number;
  maxTrailingAboveDelta?: number;
  minTrailingBelowDelta?: number;
  maxTrailingBelowDelta?: number;
  bidMultiplierUp?: string;
  bidMultiplierDown?: string;
  askMultiplierUp?: string;
  askMultiplierDown?: string;
  avgPriceMins?: number;
  minNotional?: string;
  applyMinToMarket?: boolean;
  maxNotional?: string;
  applyMaxToMarket?: boolean;
  maxNumOrders?: number;
  maxNumOrderLists?: number;
  maxNumAlgoOrders?: number;
  maxNumOrderAmends?: number;
  maxPosition?: string;
}

export enum FilterType {
  IcebergParts = 'ICEBERG_PARTS',
  LotSize = 'LOT_SIZE',
  MarketLotSize = 'MARKET_LOT_SIZE',
  MaxNumAlgoOrders = 'MAX_NUM_ALGO_ORDERS',
  MaxNumOrderAmends = 'MAX_NUM_ORDER_AMENDS',
  MaxNumOrderLists = 'MAX_NUM_ORDER_LISTS',
  MaxNumOrders = 'MAX_NUM_ORDERS',
  MaxPosition = 'MAX_POSITION',
  Notional = 'NOTIONAL',
  PercentPriceBySide = 'PERCENT_PRICE_BY_SIDE',
  PriceFilter = 'PRICE_FILTER',
  TrailingDelta = 'TRAILING_DELTA',
}

export enum OrderType {
  Limit = 'LIMIT',
  LimitMaker = 'LIMIT_MAKER',
  Market = 'MARKET',
  StopLoss = 'STOP_LOSS',
  StopLossLimit = 'STOP_LOSS_LIMIT',
  TakeProfit = 'TAKE_PROFIT',
  TakeProfitLimit = 'TAKE_PROFIT_LIMIT',
}

export enum PermissionSet {
  Leveraged = 'LEVERAGED',
  Margin = 'MARGIN',
  Margin001 = 'MARGIN_001',
  Margin002 = 'MARGIN_002',
  Spot = 'SPOT',
  TrdGrp004 = 'TRD_GRP_004',
  TrdGrp005 = 'TRD_GRP_005',
  TrdGrp006 = 'TRD_GRP_006',
  TrdGrp008 = 'TRD_GRP_008',
  TrdGrp009 = 'TRD_GRP_009',
  TrdGrp010 = 'TRD_GRP_010',
  TrdGrp011 = 'TRD_GRP_011',
  TrdGrp012 = 'TRD_GRP_012',
  TrdGrp013 = 'TRD_GRP_013',
  TrdGrp014 = 'TRD_GRP_014',
  TrdGrp015 = 'TRD_GRP_015',
  TrdGrp016 = 'TRD_GRP_016',
  TrdGrp017 = 'TRD_GRP_017',
  TrdGrp018 = 'TRD_GRP_018',
  TrdGrp019 = 'TRD_GRP_019',
  TrdGrp020 = 'TRD_GRP_020',
  TrdGrp021 = 'TRD_GRP_021',
  TrdGrp022 = 'TRD_GRP_022',
  TrdGrp023 = 'TRD_GRP_023',
  TrdGrp024 = 'TRD_GRP_024',
  TrdGrp025 = 'TRD_GRP_025',
  TrdGrp026 = 'TRD_GRP_026',
  TrdGrp027 = 'TRD_GRP_027',
  TrdGrp028 = 'TRD_GRP_028',
  TrdGrp029 = 'TRD_GRP_029',
  TrdGrp030 = 'TRD_GRP_030',
  TrdGrp031 = 'TRD_GRP_031',
  TrdGrp032 = 'TRD_GRP_032',
  TrdGrp033 = 'TRD_GRP_033',
  TrdGrp034 = 'TRD_GRP_034',
  TrdGrp035 = 'TRD_GRP_035',
  TrdGrp036 = 'TRD_GRP_036',
  TrdGrp037 = 'TRD_GRP_037',
  TrdGrp038 = 'TRD_GRP_038',
  TrdGrp039 = 'TRD_GRP_039',
  TrdGrp040 = 'TRD_GRP_040',
  TrdGrp041 = 'TRD_GRP_041',
  TrdGrp042 = 'TRD_GRP_042',
  TrdGrp043 = 'TRD_GRP_043',
  TrdGrp044 = 'TRD_GRP_044',
  TrdGrp045 = 'TRD_GRP_045',
  TrdGrp046 = 'TRD_GRP_046',
  TrdGrp047 = 'TRD_GRP_047',
  TrdGrp048 = 'TRD_GRP_048',
  TrdGrp049 = 'TRD_GRP_049',
  TrdGrp050 = 'TRD_GRP_050',
  TrdGrp051 = 'TRD_GRP_051',
  TrdGrp052 = 'TRD_GRP_052',
  TrdGrp053 = 'TRD_GRP_053',
  TrdGrp054 = 'TRD_GRP_054',
  TrdGrp055 = 'TRD_GRP_055',
  TrdGrp056 = 'TRD_GRP_056',
  TrdGrp057 = 'TRD_GRP_057',
  TrdGrp058 = 'TRD_GRP_058',
  TrdGrp059 = 'TRD_GRP_059',
  TrdGrp060 = 'TRD_GRP_060',
  TrdGrp061 = 'TRD_GRP_061',
  TrdGrp062 = 'TRD_GRP_062',
  TrdGrp063 = 'TRD_GRP_063',
  TrdGrp064 = 'TRD_GRP_064',
  TrdGrp065 = 'TRD_GRP_065',
  TrdGrp066 = 'TRD_GRP_066',
  TrdGrp067 = 'TRD_GRP_067',
  TrdGrp068 = 'TRD_GRP_068',
  TrdGrp069 = 'TRD_GRP_069',
  TrdGrp070 = 'TRD_GRP_070',
  TrdGrp071 = 'TRD_GRP_071',
  TrdGrp072 = 'TRD_GRP_072',
  TrdGrp073 = 'TRD_GRP_073',
  TrdGrp074 = 'TRD_GRP_074',
  TrdGrp075 = 'TRD_GRP_075',
  TrdGrp076 = 'TRD_GRP_076',
  TrdGrp077 = 'TRD_GRP_077',
  TrdGrp078 = 'TRD_GRP_078',
  TrdGrp079 = 'TRD_GRP_079',
  TrdGrp080 = 'TRD_GRP_080',
  TrdGrp081 = 'TRD_GRP_081',
  TrdGrp082 = 'TRD_GRP_082',
  TrdGrp083 = 'TRD_GRP_083',
  TrdGrp084 = 'TRD_GRP_084',
  TrdGrp085 = 'TRD_GRP_085',
  TrdGrp086 = 'TRD_GRP_086',
  TrdGrp087 = 'TRD_GRP_087',
  TrdGrp088 = 'TRD_GRP_088',
  TrdGrp089 = 'TRD_GRP_089',
  TrdGrp090 = 'TRD_GRP_090',
  TrdGrp091 = 'TRD_GRP_091',
  TrdGrp092 = 'TRD_GRP_092',
  TrdGrp093 = 'TRD_GRP_093',
  TrdGrp094 = 'TRD_GRP_094',
  TrdGrp095 = 'TRD_GRP_095',
  TrdGrp096 = 'TRD_GRP_096',
  TrdGrp097 = 'TRD_GRP_097',
  TrdGrp098 = 'TRD_GRP_098',
  TrdGrp099 = 'TRD_GRP_099',
  TrdGrp100 = 'TRD_GRP_100',
  TrdGrp101 = 'TRD_GRP_101',
  TrdGrp102 = 'TRD_GRP_102',
  TrdGrp103 = 'TRD_GRP_103',
  TrdGrp104 = 'TRD_GRP_104',
  TrdGrp105 = 'TRD_GRP_105',
  TrdGrp106 = 'TRD_GRP_106',
  TrdGrp107 = 'TRD_GRP_107',
  TrdGrp108 = 'TRD_GRP_108',
  TrdGrp109 = 'TRD_GRP_109',
  TrdGrp110 = 'TRD_GRP_110',
  TrdGrp111 = 'TRD_GRP_111',
  TrdGrp112 = 'TRD_GRP_112',
  TrdGrp113 = 'TRD_GRP_113',
  TrdGrp114 = 'TRD_GRP_114',
  TrdGrp115 = 'TRD_GRP_115',
  TrdGrp116 = 'TRD_GRP_116',
  TrdGrp117 = 'TRD_GRP_117',
  TrdGrp118 = 'TRD_GRP_118',
  TrdGrp119 = 'TRD_GRP_119',
  TrdGrp120 = 'TRD_GRP_120',
  TrdGrp121 = 'TRD_GRP_121',
  TrdGrp122 = 'TRD_GRP_122',
  TrdGrp123 = 'TRD_GRP_123',
  TrdGrp124 = 'TRD_GRP_124',
  TrdGrp125 = 'TRD_GRP_125',
  TrdGrp126 = 'TRD_GRP_126',
  TrdGrp127 = 'TRD_GRP_127',
  TrdGrp128 = 'TRD_GRP_128',
  TrdGrp129 = 'TRD_GRP_129',
  TrdGrp130 = 'TRD_GRP_130',
  TrdGrp131 = 'TRD_GRP_131',
  TrdGrp132 = 'TRD_GRP_132',
  TrdGrp133 = 'TRD_GRP_133',
  TrdGrp134 = 'TRD_GRP_134',
  TrdGrp135 = 'TRD_GRP_135',
  TrdGrp136 = 'TRD_GRP_136',
  TrdGrp137 = 'TRD_GRP_137',
  TrdGrp138 = 'TRD_GRP_138',
  TrdGrp139 = 'TRD_GRP_139',
  TrdGrp140 = 'TRD_GRP_140',
  TrdGrp141 = 'TRD_GRP_141',
  TrdGrp142 = 'TRD_GRP_142',
  TrdGrp143 = 'TRD_GRP_143',
  TrdGrp144 = 'TRD_GRP_144',
  TrdGrp145 = 'TRD_GRP_145',
  TrdGrp146 = 'TRD_GRP_146',
  TrdGrp147 = 'TRD_GRP_147',
  TrdGrp148 = 'TRD_GRP_148',
  TrdGrp149 = 'TRD_GRP_149',
  TrdGrp150 = 'TRD_GRP_150',
  TrdGrp151 = 'TRD_GRP_151',
  TrdGrp152 = 'TRD_GRP_152',
  TrdGrp153 = 'TRD_GRP_153',
  TrdGrp154 = 'TRD_GRP_154',
  TrdGrp155 = 'TRD_GRP_155',
  TrdGrp156 = 'TRD_GRP_156',
  TrdGrp157 = 'TRD_GRP_157',
  TrdGrp158 = 'TRD_GRP_158',
  TrdGrp159 = 'TRD_GRP_159',
  TrdGrp160 = 'TRD_GRP_160',
  TrdGrp161 = 'TRD_GRP_161',
  TrdGrp162 = 'TRD_GRP_162',
  TrdGrp163 = 'TRD_GRP_163',
  TrdGrp164 = 'TRD_GRP_164',
  TrdGrp165 = 'TRD_GRP_165',
  TrdGrp166 = 'TRD_GRP_166',
  TrdGrp167 = 'TRD_GRP_167',
  TrdGrp168 = 'TRD_GRP_168',
  TrdGrp169 = 'TRD_GRP_169',
  TrdGrp170 = 'TRD_GRP_170',
  TrdGrp171 = 'TRD_GRP_171',
  TrdGrp172 = 'TRD_GRP_172',
  TrdGrp173 = 'TRD_GRP_173',
  TrdGrp174 = 'TRD_GRP_174',
  TrdGrp175 = 'TRD_GRP_175',
  TrdGrp176 = 'TRD_GRP_176',
  TrdGrp177 = 'TRD_GRP_177',
  TrdGrp178 = 'TRD_GRP_178',
  TrdGrp179 = 'TRD_GRP_179',
  TrdGrp180 = 'TRD_GRP_180',
  TrdGrp181 = 'TRD_GRP_181',
  TrdGrp182 = 'TRD_GRP_182',
  TrdGrp183 = 'TRD_GRP_183',
  TrdGrp184 = 'TRD_GRP_184',
  TrdGrp185 = 'TRD_GRP_185',
  TrdGrp186 = 'TRD_GRP_186',
  TrdGrp187 = 'TRD_GRP_187',
  TrdGrp188 = 'TRD_GRP_188',
  TrdGrp189 = 'TRD_GRP_189',
  TrdGrp190 = 'TRD_GRP_190',
  TrdGrp191 = 'TRD_GRP_191',
  TrdGrp192 = 'TRD_GRP_192',
  TrdGrp193 = 'TRD_GRP_193',
  TrdGrp194 = 'TRD_GRP_194',
  TrdGrp195 = 'TRD_GRP_195',
  TrdGrp196 = 'TRD_GRP_196',
  TrdGrp197 = 'TRD_GRP_197',
  TrdGrp198 = 'TRD_GRP_198',
  TrdGrp199 = 'TRD_GRP_199',
  TrdGrp200 = 'TRD_GRP_200',
  TrdGrp201 = 'TRD_GRP_201',
  TrdGrp202 = 'TRD_GRP_202',
  TrdGrp203 = 'TRD_GRP_203',
  TrdGrp204 = 'TRD_GRP_204',
  TrdGrp205 = 'TRD_GRP_205',
  TrdGrp206 = 'TRD_GRP_206',
  TrdGrp207 = 'TRD_GRP_207',
  TrdGrp208 = 'TRD_GRP_208',
  TrdGrp209 = 'TRD_GRP_209',
  TrdGrp210 = 'TRD_GRP_210',
  TrdGrp211 = 'TRD_GRP_211',
  TrdGrp212 = 'TRD_GRP_212',
  TrdGrp213 = 'TRD_GRP_213',
  TrdGrp214 = 'TRD_GRP_214',
  TrdGrp215 = 'TRD_GRP_215',
  TrdGrp216 = 'TRD_GRP_216',
  TrdGrp217 = 'TRD_GRP_217',
  TrdGrp218 = 'TRD_GRP_218',
  TrdGrp219 = 'TRD_GRP_219',
  TrdGrp220 = 'TRD_GRP_220',
  TrdGrp221 = 'TRD_GRP_221',
  TrdGrp222 = 'TRD_GRP_222',
  TrdGrp223 = 'TRD_GRP_223',
  TrdGrp224 = 'TRD_GRP_224',
  TrdGrp225 = 'TRD_GRP_225',
  TrdGrp226 = 'TRD_GRP_226',
  TrdGrp227 = 'TRD_GRP_227',
  TrdGrp228 = 'TRD_GRP_228',
  TrdGrp229 = 'TRD_GRP_229',
  TrdGrp230 = 'TRD_GRP_230',
  TrdGrp231 = 'TRD_GRP_231',
  TrdGrp232 = 'TRD_GRP_232',
  TrdGrp233 = 'TRD_GRP_233',
  TrdGrp234 = 'TRD_GRP_234',
  TrdGrp235 = 'TRD_GRP_235',
  TrdGrp236 = 'TRD_GRP_236',
  TrdGrp237 = 'TRD_GRP_237',
  TrdGrp238 = 'TRD_GRP_238',
  TrdGrp239 = 'TRD_GRP_239',
  TrdGrp240 = 'TRD_GRP_240',
  TrdGrp242 = 'TRD_GRP_242',
  TrdGrp243 = 'TRD_GRP_243',
  TrdGrp244 = 'TRD_GRP_244',
  TrdGrp245 = 'TRD_GRP_245',
  TrdGrp246 = 'TRD_GRP_246',
  TrdGrp247 = 'TRD_GRP_247',
  TrdGrp248 = 'TRD_GRP_248',
  TrdGrp249 = 'TRD_GRP_249',
  TrdGrp250 = 'TRD_GRP_250',
  TrdGrp251 = 'TRD_GRP_251',
  TrdGrp252 = 'TRD_GRP_252',
  TrdGrp253 = 'TRD_GRP_253',
}

export enum QuoteAsset {
  Aeur = 'AEUR',
  Ars = 'ARS',
  Aud = 'AUD',
  Bidr = 'BIDR',
  Bkrw = 'BKRW',
  Bnb = 'BNB',
  Brl = 'BRL',
  Btc = 'BTC',
  Busd = 'BUSD',
  Bvnd = 'BVND',
  Cop = 'COP',
  Czk = 'CZK',
  Dai = 'DAI',
  Doge = 'DOGE',
  Dot = 'DOT',
  Eth = 'ETH',
  Eur = 'EUR',
  Euri = 'EURI',
  Fdusd = 'FDUSD',
  Gbp = 'GBP',
  Idr = 'IDR',
  Idrt = 'IDRT',
  Jpy = 'JPY',
  Mxn = 'MXN',
  Ngn = 'NGN',
  Pax = 'PAX',
  Pln = 'PLN',
  Ron = 'RON',
  Rub = 'RUB',
  Sol = 'SOL',
  Trx = 'TRX',
  Try = 'TRY',
  Tusd = 'TUSD',
  Uah = 'UAH',
  Usd = 'USD',
  Usd1 = 'USD1',
  Usdc = 'USDC',
  Usdp = 'USDP',
  Usds = 'USDS',
  Usdt = 'USDT',
  Ust = 'UST',
  Vai = 'VAI',
  Xrp = 'XRP',
  Zar = 'ZAR',
}

export enum Status {
  Break = 'BREAK',
  Trading = 'TRADING',
}
