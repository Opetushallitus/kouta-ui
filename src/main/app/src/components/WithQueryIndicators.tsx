import React from 'react';

import { AxiosError } from 'axios';
import { QueryObserverResult, QueryStatus } from 'react-query';

import { ErrorAlert } from '#/src/components/ErrorAlert';
import { Spin } from '#/src/components/virkailija';

export const getCombinedQueryStatus = (
  responses: Array<QueryObserverResult> = []
) => {
  if (responses.some(res => res?.status === 'loading')) {
    return 'loading';
  } else if (responses.some(res => res?.status === 'error')) {
    return 'error';
  } else if (responses.every(res => res?.status === 'success')) {
    return 'success';
  }
  return 'idle';
};

type Props = {
  children: JSX.Element;
  queryStatus: QueryStatus;
  error?: AxiosError;
  visible?: boolean;
  onRetry?: (unknown) => unknown;
};

export const WithQueryIndicators = ({
  children,
  queryStatus,
  error,
  onRetry,
}: Props) => {
  // TODO: Optional overlay spinner
  switch (queryStatus) {
    case 'idle':
      return <div></div>;
    case 'success':
      return children ? children : <div></div>;
    case 'error':
      // TODO: Get Axios response error status codes here.
      console.log(error);
      return <ErrorAlert onReload={onRetry} />;
    case 'loading':
    default:
      return <Spin />;
  }
};
