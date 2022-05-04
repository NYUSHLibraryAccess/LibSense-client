import axios, { AxiosResponse } from 'axios';
import { urlPrefix } from '@/utils/constants';
import { IDetailedOrder } from '@/utils/interfaces';

type IRemoveCdlOrderParams = {
  orderId: number;
};

type IRemoveCdlOrderResponse = {
  msg: string;
};

const removeCdlOrder = async (params: IRemoveCdlOrderParams): Promise<AxiosResponse<IRemoveCdlOrderResponse>> => {
  return axios.delete(`${urlPrefix}/v1/orders/cdl-orders?bookId=${params.orderId}`);
};

export { removeCdlOrder, IRemoveCdlOrderParams, IRemoveCdlOrderResponse };
