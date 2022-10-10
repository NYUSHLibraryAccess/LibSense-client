import { FilterOption } from '@/types/FilterOption';

const defaultFilterOptions: FilterOption[] = [
  // General filters
  { op: 'in', col: 'tags', val: [] },
  { op: 'like', col: 'title', val: '' },
  { op: 'like', col: 'orderNumber', val: '' },
  { op: 'between', col: 'createdDate', val: ['', ''] },
  { op: 'like', col: 'barcode', val: '' },
  { op: 'between', col: 'arrivalDate', val: ['', ''] },
  { op: 'in', col: 'ipsCode', title: 'IPS Code', val: [] },
  { op: 'between', col: 'ipsDate', title: 'IPS Date', val: ['', ''] },
  { op: 'in', col: 'vendorCode', metaDataIndex: 'vendors', val: [] },
  // CDL filters
  { op: 'in', col: 'material', val: [], cdlOnly: true },
  { op: 'in', col: 'materialType', val: [], cdlOnly: true },
  { op: 'in', col: 'cdlItemStatus', title: 'CDL Item Status', metaDataIndex: 'cdlTags', val: [], cdlOnly: true },
  { op: 'between', col: 'orderRequestDate', val: ['', ''], cdlOnly: true },
  { op: 'between', col: 'scanningVendorPaymentDate', val: ['', ''], cdlOnly: true },
  { op: 'between', col: 'pdfDeliveryDate', title: 'PDF Delivery Date', val: ['', ''], cdlOnly: true },
  { op: 'between', col: 'backToKarmsDate', title: 'Back to KARMS Date', val: ['', ''], cdlOnly: true },
  // Note filters
  { op: 'like', col: 'trackingNote', val: '' },
  { op: 'like', col: 'libraryNote', val: '' },
];

export { defaultFilterOptions };
