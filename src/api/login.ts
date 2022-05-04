import axios, { AxiosResponse } from 'axios';
import { urlPrefix } from '@/utils/constants';
import { IRole } from '@/utils/interfaces';

type ILoginParams = {
  username: string;
  password: string;
};

type ILoginResponse = {
  username: string;
  role: IRole;
};

const login = async (params: ILoginParams): Promise<AxiosResponse<ILoginResponse>> => {
  return axios.post(`${urlPrefix}/v1/login`, { ...params }, { withCredentials: true });
};

export { login, ILoginParams, ILoginResponse };
