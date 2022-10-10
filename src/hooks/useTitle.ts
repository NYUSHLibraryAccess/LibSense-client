import { useEffect } from 'react';

import { useAppDispatch } from '@/store';
import { updateTitle } from '@/slices/metaTag';

const useTitle = (title: string, titleOnly = false) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(updateTitle(titleOnly ? title : `${title} | ${__NAME__}`));
  }, []);
};

export { useTitle };
