import { ITag } from '@/utils/interfaces';

// To compose request URL
const devUrlPrefix = '';
const prodUrlPrefix = '/api';
export const urlPrefix = __IS_DEV__ ? devUrlPrefix : prodUrlPrefix;

// For tag enumerating and sorting
export const allTags: ITag[] = ['Rush', 'Non-Rush', 'CDL', 'Local', 'NYC', 'Course-Reserve', 'DVD', 'ILL', 'Sensitive'];
