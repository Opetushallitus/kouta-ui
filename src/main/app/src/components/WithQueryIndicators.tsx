import React from 'react';

import { AxiosError } from 'axios';
import { QueryStatus } from 'react-query';

import { ErrorAlert } from '#/src/components/ErrorAlert';
import { Spin } from '#/src/components/virkailija';

export const getCombinedQueryStatus = (statusList = []) => {
  if (statusList.some(status => status === 'loading')) {
    return 'loading';
  } else if (statusList.some(status => status === 'error')) {
    return 'error';
  } else if (statusList.every(status => status === 'success')) {
    return 'success';
  }
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
