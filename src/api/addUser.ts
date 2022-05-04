import axios, { AxiosResponse } from 'axios';
import { urlPrefix } from '@/utils/constants';
import { IRole } from '@/utils/interfaces';

type IAddUserParams = {
  username: string;
  role: IRole;
  password: string;
};

// TODO: make this SystemUser public type
type IAddUserResponse = {
  username: string;
  role: IRole;
};

const addUser = async (params: IAddUserParams): Promise<AxiosResponse<IAddUserResponse>> => {
  return axios.post(`${urlPrefix}/v1/add_user`, { ...params }, { withCredentials: true });
};

export { addUser, IAddUserParams, IAddUserResponse };
