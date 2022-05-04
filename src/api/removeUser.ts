import axios, { AxiosResponse } from 'axios';
import { urlPrefix } from '@/utils/constants';
import { IRole } from '@/utils/interfaces';

// TODO: rename remove to delete
type IRemoveUserParams = {
  username: string;
};

// TODO: make this BasicResponse public type
type IRemoveUserResponse = {
  msg: string;
};

const removeUser = async (params: IRemoveUserParams): Promise<AxiosResponse<IRemoveUserResponse>> => {
  return axios.delete(`${urlPrefix}/v1/delete_user?username=${params.username}`, { withCredentials: true });
};

export { removeUser, IRemoveUserParams, IRemoveUserResponse };
