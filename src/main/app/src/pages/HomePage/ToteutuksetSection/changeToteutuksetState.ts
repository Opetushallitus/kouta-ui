import { useCallback } from 'react';

import _ from 'lodash';
import { UseMutateAsyncFunction, useMutation } from 'react-query';

import { JULKAISUTILA } from '#/src/constants';
import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { EntitySelection } from '#/src/machines/batchOpsMachine';

type ToteutusTilaChangeResponseItem = {
  oid: string;
  status: 'success' | 'error';
};

type ToteutuksetTilaChangeResponseData = Array<ToteutusTilaChangeResponseItem>;

type ChangeToteutustenTilaProps = {
  entities: EntitySelection;
  tila?: JULKAISUTILA;
};

export type CopyToteutuksetMutationFunctionAsync = UseMutateAsyncFunction<
  ToteutuksetTilaChangeResponseData,
  unknown,
  ChangeToteutustenTilaProps
>;

const useChangeToteutustenTila = () => {
  const apiUrls = useUrls();
  const httpClient = useHttpClient();

  return useCallback(
    async ({ entities, tila }: ChangeToteutustenTilaProps) => {
      const lastModified = new Date().toUTCString();

      const result = await httpClient.post(
        apiUrls.url('kouta-backend.toteutukset-tilamuutos', tila),
        _.map(entities, 'oid'),
        {
          headers: {
            'X-If-Unmodified-Since': lastModified,
          },
        }
      );
      return result.data as ToteutuksetTilaChangeResponseData;
    },
    [httpClient, apiUrls]
  );
};

export const useChangeToteutuksetTilaMutation = () => {
  const changeToteutustenTila = useChangeToteutustenTila();
  return useMutation<
    ToteutuksetTilaChangeResponseData,
    unknown,
    ChangeToteutustenTilaProps
  >('changeToteutustenTila', changeToteutustenTila);
};
