import axios, { AxiosResponse } from 'axios';
import { urlPrefix } from '@/utils/constants';
import { IDetailedOrder } from '@/utils/interfaces';

type IGetDetailedCdlOrderParams = {
  orderId: number;
};

type IGetDetailedCdlOrderResponse = IDetailedOrder;

const getDetailedCdlOrder = async (
  params: IGetDetailedCdlOrderParams
): Promise<AxiosResponse<IGetDetailedCdlOrderResponse>> => {
  return axios.get(`${urlPrefix}/v1/orders/cdl-orders/detail?bookId=${params.orderId}`, { withCredentials: true });
};

export { getDetailedCdlOrder, IGetDetailedCdlOrderParams, IGetDetailedCdlOrderResponse };
