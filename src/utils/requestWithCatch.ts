import { message } from 'antd';
import { AxiosResponse } from 'axios';

const requestWithCatch = async <T>(res: Promise<AxiosResponse<T>>): Promise<T | undefined> => {
  try {
    const { data } = await res;
    return data;
  } catch (err) {
    message.error(`Network request failed: ${err.message}`);
  }
};

export { requestWithCatch };
