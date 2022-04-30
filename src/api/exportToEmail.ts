import axios, { AxiosResponse } from 'axios';
import { serverAddress } from '@/utils/constants';

type IExportToEmailParams = {
  report_types: string[];
  username: string;
  email: string;
};

type IExportToEmailResponse = string;

const exportToEmail = async (params: IExportToEmailParams): Promise<AxiosResponse<IExportToEmailResponse>> => {
  return axios.post(`http://${serverAddress}/v1/report/send-report`, { ...params });
};

export { IExportToEmailParams, IExportToEmailResponse, exportToEmail };
