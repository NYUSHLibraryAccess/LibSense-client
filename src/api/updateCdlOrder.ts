import axios, { AxiosResponse } from 'axios';
import { urlPrefix } from '@/utils/constants';
import { ICdlOrder, IDetailedCdlOrder, IDetailedOrder, IOrder } from '@/utils/interfaces';

type IUpdateCdlOrderParams = { bookId: number } & Pick<
  ICdlOrder & IDetailedCdlOrder,
  | 'orderPurchasedDate'
  | 'physicalCopyStatus'
  | 'pdfDeliveryDate'
  | 'bobcatPermanentLink'
  | 'vendorFileUrl'
  | 'author'
  | 'cdlItemStatus'
  | 'orderRequestDate'
  | 'dueDate'
  | 'scanningVendorPaymentDate'
  | 'backToKarmsDate'
  | 'circPdfUrl'
  | 'filePassword'
  | 'pages'
>;

type IUpdateCdlOrderResponse = { msg: string };

const updateCdlOrder = async (params: IUpdateCdlOrderParams): Promise<AxiosResponse<IUpdateCdlOrderResponse>> => {
  return axios.patch(
    `${urlPrefix}/v1/orders/cdl-orders`,
    {
      ...params,
      cdlItemStatus: params.cdlItemStatus[0],
    },
    { withCredentials: true }
  );
};

export { updateCdlOrder, IUpdateCdlOrderParams, IUpdateCdlOrderResponse };
