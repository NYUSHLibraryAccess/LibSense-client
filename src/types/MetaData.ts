import { OrderTag } from '@/types/OrderTag';

type MetaData = {
  ipsCode: string[];
  tags: OrderTag[];
  vendors: string[];
  oldestDate: string;
  material: string[];
  materialType: string[];
  cdlTags: string[];
  supportedReport: string[];
  physicalCopyStatus: string[];
};

export { MetaData };
