import { useCallback } from 'react';

import { useMutation } from 'react-query';

import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { useHakukohdeTila } from '#/src/pages/HomePage/HakukohteetSection/index';
import { map } from '#/src/utils/lodashFpUncapped';

type HakukohdeTilaChangeResponseItem = {
  oid: string;
  status: 'success' | 'error';
};

type HakukohteetTilaChangeResponseData = Array<HakukohdeTilaChangeResponseItem>;

const useChangeHakukohteidenTila = () => {
  const apiUrls = useUrls();
  const httpClient = useHttpClient();
  const { tila } = useHakukohdeTila();

  return useCallback(
    async (hakukohteet: Array<string>) => {
      const lastModified = new Date().toUTCString();

      const result = await httpClient.post(
        apiUrls.url('kouta-backend.hakukohteet-tilamuutos', tila?.value),
        map('oid', hakukohteet),
        {
          headers: {
            'X-If-Unmodified-Since': lastModified,
          },
        }
      );
      return result.data as HakukohteetTilaChangeResponseData;
    },
    [httpClient, apiUrls, tila]
  );
};

export const useChangeHakukohteetTilaMutation = () => {
  const changeHakukohteidenTila = useChangeHakukohteidenTila();
  return useMutation<HakukohteetTilaChangeResponseData, unknown, Array<string>>(
    changeHakukohteidenTila
  );
};
