// Type definitions used by API

export type IRole = 'System Admin' | 'User';

export type IOverview = {
  localRushPending: number;
  cdlPending: number;
  avgCdlScan: number;
  avgCdl: number;
  avgRushNyc: number;
  avgRushLocal: number;
  maxCdlScan: number;
  maxCdl: number;
  maxRushNyc: number;
  maxRushLocal: number;
  minCdlScan: number;
  minCdl: number;
  minRushNyc: number;
  minRushLocal: number;
};

export type ITag = 'Rush' | 'Non-Rush' | 'CDL' | 'Local' | 'NYC' | 'Course-Reserve' | 'DVD' | 'ILL' | 'Sensitive';

export type IMetadata = {
  ipsCode: string[];
  tags: ITag[];
  vendors: string[];
  oldestDate: string;
  material: string[];
  materialType: string[];
  cdlTags: string[];
  physicalCopyStatus: string[];
};

export type IOrder = {
  id: number;
  tags: ITag[];
  barcode: string;
  title: string;
  orderNumber: string;
  createdDate: string;
  arrivalDate: string;
  ipsCode: string;
  ips: string;
  ipsDate: string;
  vendorCode: string;
  libraryNote: string;
};

export type IDetailedOrder = IOrder & {
  bsn: string;
  arrivalText: string;
  arrivalStatus: string;
  arrivalOperator: string;
  itemsCreated: string;
  itemStatus: string;
  material: string;
  collection: string;
  ipsUpdateDate: string;
  ipsCodeOperator: string;
  updateDate: string;
  sublibrary: string;
  orderStatus: string;
  invoiceStatus: string;
  materialType: string;
  orderType: string;
  orderUnit: string;
  totalPrice: string;
  orderStatusUpdateDate: string;
  trackingNote: string;
};

export type ICdlOrder = IOrder & {
  cdlItemStatus: string[];
  orderRequestDate: string;
  scanningVendorPaymentDate: string;
  pdfDeliveryDate: string;
  backToKarmsDate: string;
  circPdfUrl: string;
};

export type IDetailedCdlOrder = IDetailedOrder &
  ICdlOrder & {
    orderPurchasedDate: string;
    dueDate: string;
    physicalCopyStatus: string;
    vendorFileUrl: string;
    bobcatPermanentLink: string;
    filePassword: string;
    author: string;
    pages: string;
  };

export type IColumn = keyof IOrder | keyof IDetailedOrder | keyof ICdlOrder | keyof IDetailedCdlOrder;

export type IFilter =
  | { op: 'in'; col: 'tags'; val: ITag[] }
  | { op: 'in'; col: Exclude<IColumn, 'tags'>; val: string[] }
  | { op: 'like'; col: IColumn; val: string }
  | { op: 'between'; col: IColumn; val: [string, string] };

export type IReportType = 'RushLocal' | 'CDLOrder' | 'ShanghaiOrder';
