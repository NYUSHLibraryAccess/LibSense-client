import axios, { AxiosResponse } from 'axios';
import { urlPrefix } from '@/utils/constants';
import { IFilter, IOrder } from '@/utils/interfaces';

type IGetAllOrdersParams = {
  pageIndex: number;
  pageSize: number;
  sorter?: { col: string; desc: boolean };
  filters?: IFilter[];
};

type IGetAllOrdersResponse = {
  pageIndex: number;
  pageLimit: number;
  totalRecords: number;
  result: IOrder[];
};

const getAllOrders = async (params: IGetAllOrdersParams): Promise<AxiosResponse<IGetAllOrdersResponse>> => {
  return axios.post(`${urlPrefix}/v1/orders/all-orders`, { ...params }, { withCredentials: true });
};

export { getAllOrders, IGetAllOrdersParams, IGetAllOrdersResponse };
