import React from 'react';

import { QueryObserverResult } from 'react-query';

import ErrorAlert from './ErrorAlert';
import ListSpin from './ListSpin';

export const getCombinedQueryResult = (
  responses: Array<QueryObserverResult> = []
) => {
  switch (true) {
    case responses.some(res => res?.status === 'loading'):
      return 'loading';
    case responses.some(res => res?.status === 'error'):
      return 'error';
    case responses.every(res => res?.status === 'success'):
      return 'success';
    default:
      return 'idle';
  }
};

type Props = {
  children: JSX.Element;
  queryResult: QueryObserverResult | Array<QueryObserverResult>;
};

export const QueryResultWrapper = ({ children, queryResult }: Props) => {
  let status, isFetching, errors, refetch;
  if (Array.isArray(queryResult)) {
    status = getCombinedQueryResult(queryResult);
    isFetching = queryResult.some(({ isFetching }) => isFetching);
    errors = queryResult?.map(({ error }) => error).filter(Boolean);
    refetch = () => queryResult.forEach(({ refetch }) => refetch());
  } else {
    status = queryResult?.status;
    isFetching = queryResult?.isFetching;
    errors = queryResult?.error ? [queryResult?.error] : undefined;
    refetch = queryResult?.refetch;
  }

  if (isFetching) {
    return <ListSpin />;
  }

  switch (status) {
    case 'idle':
      return <div></div>;
    case 'success':
      return children ? children : <div></div>;
    case 'error':
      // TODO: Get Axios response error status codes here.
      console.error(errors);
      return <ErrorAlert onReload={refetch} />;
    case 'loading':
    default:
      return <ListSpin center />;
  }
};
