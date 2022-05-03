import axios, { AxiosResponse } from 'axios';
import { urlPrefix } from '@/utils/constants';
import { IMetadata } from '@/utils/interfaces';

type IGetMetadataResponse = IMetadata;

const getMetadata = async (): Promise<AxiosResponse<IGetMetadataResponse>> => {
  return axios.get(`${urlPrefix}/v1/data/metadata`);
};

export { getMetadata, IGetMetadataResponse };
