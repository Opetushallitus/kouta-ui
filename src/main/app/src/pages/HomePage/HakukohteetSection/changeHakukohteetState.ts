import { useCallback } from 'react';

import { useMutation } from 'react-query';

import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { useNewTila } from '#/src/pages/HomePage/HakukohteetSection/index';
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
  const { tila } = useNewTila();
  return useCallback(
    async (hakukohteet: Array<string>) => {
      console.log('Vaihdetaan hakukohteiden:');
      console.log(hakukohteet);
      console.log(map('oid', hakukohteet));
      console.log('tilaksi:');
      console.log(tila?.value);
      const result = await httpClient.post(
        apiUrls.url('kouta-backend.hakukohteet-tilamuutos', tila?.value),
        map('oid', hakukohteet)
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
