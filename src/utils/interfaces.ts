type ITag = 'Rush' | 'Non-Rush' | 'CDL' | 'Local' | 'NYC' | 'Course-Reserve' | 'DVD' | 'ILL' | 'Sensitive';

type IOrder = {
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
  overrideDate: string;
};

type IDetailedOrder = IOrder & {
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

type IMetadata = {
  ipsCode: (string | null)[];
  tags: (string | null)[];
  vendors: (string | null)[];
  oldestDate: string;
  material: (string | null)[];
  materialType: (string | null)[];
} & Record<string, string>;

export { ITag, IOrder, IDetailedOrder, IMetadata };
