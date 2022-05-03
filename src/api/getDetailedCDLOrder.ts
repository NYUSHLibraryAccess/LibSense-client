import axios, { AxiosResponse } from 'axios';
import { urlPrefix } from '@/utils/constants';
import { IDetailedOrder } from '@/utils/interfaces';

type IGetDetailedCDLOrderParams = {
  orderId: number;
};

type IGetDetailedCDLOrderResponse = IDetailedOrder;

const getDetailedCDLOrder = async (
  params: IGetDetailedCDLOrderParams
): Promise<AxiosResponse<IGetDetailedCDLOrderResponse>> => {
  return axios.get(`${urlPrefix}/v1/orders/cdl-orders/detail?bookId=${params.orderId}`);
};

export { getDetailedCDLOrder, IGetDetailedCDLOrderParams, IGetDetailedCDLOrderResponse };
