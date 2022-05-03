import axios, { AxiosResponse } from 'axios';
import { urlPrefix } from '@/utils/constants';

type IExportToEmailParams = {
  report_types: string[];
  username: string;
  email: string;
};

type IExportToEmailResponse = {
  msg: string;
};

const exportToEmail = async (params: IExportToEmailParams): Promise<AxiosResponse<IExportToEmailResponse>> => {
  return axios.post(`${urlPrefix}/v1/report/send-report`, { ...params });
};

export { IExportToEmailParams, IExportToEmailResponse, exportToEmail };
