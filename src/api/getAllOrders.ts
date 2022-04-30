import axios, { AxiosResponse } from 'axios';
import { IOrder } from '@/utils/interfaces';
import { serverAddress } from '@/utils/constants';

type IFilter =
  | { op: 'in'; col: string; val: string[] }
  | { op: 'like'; col: string; val: string }
  | { op: 'between'; col: string; val: [string, string] };

type IGetAllOrdersParams = {
  pageIndex: number;
  pageSize: number;
  filters?: IFilter[];
  sorter?: { col: string; desc: boolean };
};

type IGetAllOrdersResponse = {
  pageIndex: number;
  pageLimit: number;
  totalRecords: number;
  result: IOrder[];
};

const getAllOrders = async (params: IGetAllOrdersParams): Promise<AxiosResponse<IGetAllOrdersResponse>> => {
  return axios.post(`http://${serverAddress}/v1/orders/all-orders`, { ...params });
};

export { IFilter, IGetAllOrdersParams, IGetAllOrdersResponse, getAllOrders };
