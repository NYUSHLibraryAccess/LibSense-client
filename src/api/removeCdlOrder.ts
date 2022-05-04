import axios, { AxiosResponse } from 'axios';
import { urlPrefix } from '@/utils/constants';
import { IDetailedOrder } from '@/utils/interfaces';

// TODO: rename remove to delete
type IRemoveCdlOrderParams = {
  orderId: number;
};

type IRemoveCdlOrderResponse = {
  msg: string;
};

const removeCdlOrder = async (params: IRemoveCdlOrderParams): Promise<AxiosResponse<IRemoveCdlOrderResponse>> => {
  return axios.delete(`${urlPrefix}/v1/orders/cdl-orders?bookId=${params.orderId}`, { withCredentials: true });
};

export { removeCdlOrder, IRemoveCdlOrderParams, IRemoveCdlOrderResponse };
