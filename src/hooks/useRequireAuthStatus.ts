import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useWhoAmIQuery } from '@/services/auth';

const useRequireAuthStatus = (requiredAuthStatus?: boolean, redirectTo?: string) => {
  const navigate = useNavigate();
  const { isFetching, isSuccess, isError, error, refetch } = useWhoAmIQuery();

  useEffect(() => {
    if (isSuccess && requiredAuthStatus === false) {
      navigate(redirectTo || '/');
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError && 'status' in error && error.status === 401 && requiredAuthStatus === true) {
      navigate(redirectTo || '/login');
    }
  }, [isError, error]);

  return { isFetchingAuthStatus: isFetching, refetchAuthStatus: refetch };
};

export { useRequireAuthStatus };
