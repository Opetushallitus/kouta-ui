import { useCallback } from 'react';

import { useMutation } from 'react-query';

import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { map } from '#/src/utils/lodashFpUncapped';

type HakukohdeTilaChangeResponseItem = {
  oid: string;
  status: 'success' | 'error';
  created: {
    hakukohdeOid?: string;
  };
};

type HakukohteetTilaChangeResponseData = Array<HakukohdeTilaChangeResponseItem>;

const useChangeHakukohteidenTila = () => {
  const apiUrls = useUrls();
  const httpClient = useHttpClient();
  return useCallback(
    async (hakukohteet: Array<string>) => {
      const result = await httpClient.put(
        apiUrls.url('kouta-backendXXXX.toteutus-copy'),
        map('oid', hakukohteet)
      );
      return result.data as HakukohteetTilaChangeResponseData;
    },
    [httpClient, apiUrls]
  );
};

export const useChangeHakukohteetTilaMutation = () => {
  const changeHakukohteidenTila = useChangeHakukohteidenTila();
  return useMutation<HakukohteetTilaChangeResponseData, unknown, Array<string>>(
    changeHakukohteidenTila
  );
};
