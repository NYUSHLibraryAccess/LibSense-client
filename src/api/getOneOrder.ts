import axios, { AxiosResponse } from 'axios';
import { IDetailedOrder } from '@/utils/interfaces';
import { serverAddress } from '@/utils/constants';

type IGetOneOrderParams = {
  orderId: number;
};
type IGetOneOrderResponse = IDetailedOrder;

const getOneOrder = async (params: IGetOneOrderParams): Promise<AxiosResponse<IGetOneOrderResponse>> => {
  return axios.get(`http://${serverAddress}/v1/orders/all-orders/detail?order_id=${params.orderId}`);
};

export { getOneOrder, IGetOneOrderParams, IGetOneOrderResponse };
