import axios, { AxiosResponse } from 'axios';
import { serverAddress } from '@/utils/constants';
import { IMetadata } from '@/utils/interfaces';

type IGetMetadataResponse = IMetadata;

const getMetadata = async (): Promise<AxiosResponse<IGetMetadataResponse>> => {
  return axios.get(`http://${serverAddress}/v1/data/metadata`);
};

export { getMetadata, IGetMetadataResponse };
