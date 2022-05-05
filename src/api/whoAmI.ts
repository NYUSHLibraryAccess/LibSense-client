import axios, { AxiosResponse } from 'axios';
import { urlPrefix } from '@/utils/constants';
import { IRole } from '@/utils/interfaces';

type IWhoAmIResponse = {
  username: string;
  role: IRole;
};

const whoAmI = async (): Promise<AxiosResponse<IWhoAmIResponse>> => {
  return axios.get(`${urlPrefix}/v1/whoami`, { withCredentials: true });
};

export { whoAmI, IWhoAmIResponse };
