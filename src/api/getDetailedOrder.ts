import axios, { AxiosResponse } from 'axios';
import { urlPrefix } from '@/utils/constants';
import { IDetailedOrder } from '@/utils/interfaces';

type IGetDetailedOrderParams = {
  orderId: number;
};

type IGetDetailedOrderResponse = IDetailedOrder;

const getDetailedOrder = async (params: IGetDetailedOrderParams): Promise<AxiosResponse<IGetDetailedOrderResponse>> => {
  return axios.get(`${urlPrefix}/v1/orders/all-orders/detail?bookId=${params.orderId}`, { withCredentials: true });
};

export { getDetailedOrder, IGetDetailedOrderParams, IGetDetailedOrderResponse };
