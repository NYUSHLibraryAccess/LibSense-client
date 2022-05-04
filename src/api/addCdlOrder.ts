import axios, { AxiosResponse } from 'axios';
import { urlPrefix } from '@/utils/constants';
import { ICdlOrder, IDetailedCdlOrder, IDetailedOrder, IOrder } from '@/utils/interfaces';

type IAddCdlOrderParams = {
  orderId: number;
};

type IAddCdlOrderResponse = {
  order_purchased_date: string;
  book_id: number;
  physical_copy_status: string;
  pdf_delivery_date: string;
  bobcat_permanent_link: string;
  vendor_file_url: string;
  author: string;
  cdl_item_status: string;
  order_request_date: string;
  due_date: string;
  scanning_vendor_payment_date: string;
  back_to_karms_date: string;
  circ_pdf_url: string;
  file_password: string;
  pages: string;
};

const addCdlOrder = async (params: IAddCdlOrderParams): Promise<AxiosResponse<IAddCdlOrderResponse>> => {
  return axios.post(
    `${urlPrefix}/v1/orders/cdl-orders/new_cdl`,
    {
      bookId: params.orderId,
      cdlItemStatus: 'CDL Silent',
    },
    { withCredentials: true }
  );
};

export { addCdlOrder, IAddCdlOrderParams, IAddCdlOrderResponse };
