import { useCallback } from 'react';

import _ from 'lodash';
import { UseMutateAsyncFunction, useMutation } from 'react-query';

import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { EntitySelection } from '#/src/machines/batchOpsMachine';

type ToteutusCopyResponseItem = {
  oid: string;
  status: 'success' | 'error';
  created: {
    toteutusOid?: string;
  };
};

type ToteutusCopyResponseData = Array<ToteutusCopyResponseItem>;

type CopyToteutuksetProps = {
  entities: EntitySelection;
};

export type CopyToteutuksetMutationFunctionAsync = UseMutateAsyncFunction<
  ToteutusCopyResponseData,
  unknown,
  CopyToteutuksetProps
>;

const useCopyToteutukset = () => {
  const apiUrls = useUrls();
  const httpClient = useHttpClient();
  return useCallback(
    async ({ entities }: CopyToteutuksetProps) => {
      const result = await httpClient.put(
        apiUrls.url('kouta-backend.toteutus-copy'),
        _.map(entities, 'oid')
      );
      return result.data as ToteutusCopyResponseData;
    },
    [httpClient, apiUrls]
  );
};

export const useCopyToteutuksetMutation = () => {
  const copyToteutukset = useCopyToteutukset();
  return useMutation<ToteutusCopyResponseData, unknown, CopyToteutuksetProps>(
    copyToteutukset
  );
};
