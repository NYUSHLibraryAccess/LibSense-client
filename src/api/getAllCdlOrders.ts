import axios, { AxiosResponse } from 'axios';
import { urlPrefix } from '@/utils/constants';
import { ICdlOrder, IFilter } from '@/utils/interfaces';

type IGetAllCdlOrdersParams = {
  pageIndex: number;
  pageSize: number;
  sorter?: { col: string; desc: boolean };
  filters?: IFilter[];
};

type IGetAllCdlOrdersResponse = {
  pageIndex: number;
  pageLimit: number;
  totalRecords: number;
  result: ICdlOrder[];
};

const getAllCdlOrders = async (params: IGetAllCdlOrdersParams): Promise<AxiosResponse<IGetAllCdlOrdersResponse>> => {
  return axios.post(`${urlPrefix}/v1/orders/cdl-orders`, { ...params });
};

export { getAllCdlOrders, IGetAllCdlOrdersParams, IGetAllCdlOrdersResponse };
