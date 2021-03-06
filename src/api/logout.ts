import axios, { AxiosResponse } from 'axios';
import { urlPrefix } from '@/utils/constants';

type ILogoutResponse = {
  msg: string;
};

const logout = async (): Promise<AxiosResponse<ILogoutResponse>> => {
  return axios.post(`${urlPrefix}/v1/logout`, { withCredentials: true });
};

export { logout, ILogoutResponse };
