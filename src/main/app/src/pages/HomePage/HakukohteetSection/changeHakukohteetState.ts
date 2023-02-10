import { useCallback } from 'react';

import _ from 'lodash';
import { useMutation } from 'react-query';

import { JULKAISUTILA } from '#/src/constants';
import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';

type HakukohdeTilaChangeResponseItem = {
  oid: string;
  status: 'success' | 'error';
};

type HakukohteetTilaChangeResponseData = Array<HakukohdeTilaChangeResponseItem>;

type ChangeHakukohteidenTilaProps = {
  hakukohteet: Array<string>;
  tila: JULKAISUTILA;
};

const useChangeHakukohteidenTila = () => {
  const apiUrls = useUrls();
  const httpClient = useHttpClient();

  return useCallback(
    async ({ hakukohteet, tila }: ChangeHakukohteidenTilaProps) => {
      const lastModified = new Date().toUTCString();

      const result = await httpClient.post(
        apiUrls.url('kouta-backend.hakukohteet-tilamuutos', tila),
        _.map(hakukohteet, 'oid'),
        {
          headers: {
            'X-If-Unmodified-Since': lastModified,
          },
        }
      );
      return result.data as HakukohteetTilaChangeResponseData;
    },
    [httpClient, apiUrls]
  );
};

export const useChangeHakukohteetTilaMutation = () => {
  const changeHakukohteidenTila = useChangeHakukohteidenTila();
  return useMutation<
    HakukohteetTilaChangeResponseData,
    unknown,
    ChangeHakukohteidenTilaProps
  >('changeHakukohteidenTila', changeHakukohteidenTila);
};
