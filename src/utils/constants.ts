import { ITag } from '@/utils/interfaces';

// To compose request URL
const devUrlPrefix = 'http://pre.libsense:8081';
const prodUrlPrefix = '';
export const urlPrefix = __IS_DEV__ ? devUrlPrefix : prodUrlPrefix;

// For tag enumerating and sorting
export const allTags: ITag[] = ['Rush', 'Non-Rush', 'CDL', 'Local', 'NYC', 'Course-Reserve', 'DVD', 'ILL', 'Sensitive'];
