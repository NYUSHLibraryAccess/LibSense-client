import axios, { AxiosResponse } from 'axios';
import { urlPrefix } from '@/utils/constants';
import { IOverview } from '@/utils/interfaces';

type IGetOverviewResponse = IOverview;

const getOverview = async (): Promise<AxiosResponse<IGetOverviewResponse>> => {
  return axios.get(`${urlPrefix}/v1/overview`);
};

export { getOverview, IGetOverviewResponse };
