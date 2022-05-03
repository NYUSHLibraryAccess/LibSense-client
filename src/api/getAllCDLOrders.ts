import axios, { AxiosResponse } from 'axios';
import { urlPrefix } from '@/utils/constants';
import { ICdlOrder, IFilter } from '@/utils/interfaces';

type IGetAllCDLOrdersParams = {
  pageIndex: number;
  pageSize: number;
  sorter?: { col: string; desc: boolean };
  filters?: IFilter[];
};

type IGetAllCDLOrdersResponse = {
  pageIndex: number;
  pageLimit: number;
  totalRecords: number;
  result: ICdlOrder[];
};

const getAllCDLOrders = async (params: IGetAllCDLOrdersParams): Promise<AxiosResponse<IGetAllCDLOrdersResponse>> => {
  return axios.post(`${urlPrefix}/v1/orders/cdl-orders`, { ...params });
};

export { getAllCDLOrders, IGetAllCDLOrdersParams, IGetAllCDLOrdersResponse };
