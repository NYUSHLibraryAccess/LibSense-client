type CdlOnlyOrder = {
  cdlItemStatus: 'CDL Silent' | 'Circ PDF Available' | 'Vendor PDF Available' | 'CDL DVD' | 'Requested' | 'On Loan';
  orderRequestDate: string;
  scanningVendorPaymentDate: string;
  pdfDeliveryDate: string;
  backToKarmsDate: string;
  circPdfUrl: string;
  dueDate: string;
  physicalCopyStatus: 'Not Arrived' | 'On Shelf' | 'DVD';
  vendorFileUrl: string;
  bobcatPermanentLink: string;
  filePassword: string;
  author: string;
  pages: string;
};

export { CdlOnlyOrder };
