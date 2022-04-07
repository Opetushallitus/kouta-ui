import { useCallback } from 'react';

import { useMutation } from 'react-query';

import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { map } from '#/src/utils/lodashFpUncapped';

type ToteutusCopyResponseItem = {
  oid: string;
  status: 'success' | 'error';
  created: {
    toteutusOid?: string;
  };
};

type ToteutusCopyResponseData = Array<ToteutusCopyResponseItem>;

const useCopyToteutukset = () => {
  const apiUrls = useUrls();
  const httpClient = useHttpClient();
  return useCallback(
    async (toteutukset: Array<string>) => {
      const result = await httpClient.put(
        apiUrls.url('kouta-backend.toteutus-copy'),
        map('oid', toteutukset)
      );
      return result.data as ToteutusCopyResponseData;
    },
    [httpClient, apiUrls]
  );
};

export const useCopyToteutuksetMutation = () => {
  const copyToteutukset = useCopyToteutukset();
  return useMutation<ToteutusCopyResponseData, unknown, Array<string>>(
    copyToteutukset
  );
};
