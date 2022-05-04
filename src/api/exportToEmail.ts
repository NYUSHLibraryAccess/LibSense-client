import axios, { AxiosResponse } from 'axios';
import { urlPrefix } from '@/utils/constants';
import { IReportType } from '@/utils/interfaces';

// TODO: rename this
type IExportToEmailParams = {
  reportType: IReportType[];
  username: string;
  email: string;
};

type IExportToEmailResponse = {
  msg: string;
};

const exportToEmail = async (params: IExportToEmailParams): Promise<AxiosResponse<IExportToEmailResponse>> => {
  return axios.post(`${urlPrefix}/v1/report/send-report`, { ...params }, { withCredentials: true });
};

export { IExportToEmailParams, IExportToEmailResponse, exportToEmail };
