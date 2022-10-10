import { SerializedError } from '@reduxjs/toolkit';

import { AxiosBaseQueryError } from '@/services/baseQuery';

type FriendlyError = {
  status: number;
  data: { detail: string };
};

// Check whether an error has friendly error message or not.
const isFriendlyError = (error: AxiosBaseQueryError | SerializedError): error is FriendlyError => {
  return (
    'status' in error &&
    typeof error.data === 'object' &&
    typeof (error as FriendlyError).data.detail === 'string' &&
    !!(error as FriendlyError).data.detail
  );
};

export { isFriendlyError };
