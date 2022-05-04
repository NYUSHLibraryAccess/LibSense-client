import axios, { AxiosResponse } from 'axios';
import { urlPrefix } from '@/utils/constants';
import { IRole } from '@/utils/interfaces';

// TODO: make this BasicResponse public type
type IListUsersResponse = {
  username: string;
  role: IRole;
}[];

const listUsers = async (): Promise<AxiosResponse<IListUsersResponse>> => {
  return axios.get(`${urlPrefix}/v1/all_users`, { withCredentials: true });
};

export { listUsers, IListUsersResponse };
