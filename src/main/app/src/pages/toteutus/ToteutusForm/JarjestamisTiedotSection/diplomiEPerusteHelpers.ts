import { useMemo } from 'react';

import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';

const getEPerusteLukiodiplomit = async ({ httpClient, apiUrls }) => {
  const { data } = await httpClient.get(
    apiUrls.url('eperusteet-service.lukiodiplomit')
  );
  return data;
};

export const useEPerusteLukiodiplomit = () =>
  useApiQuery(
    'getEPerusteLukiodiplomit',
    getEPerusteLukiodiplomit,
    {},
    {
      ...LONG_CACHE_QUERY_OPTIONS,
      select: data => data?.moduulit,
    }
  );

const getEPerusteLukiodiplomiTiedot = async ({
  httpClient,
  apiUrls,
  moduuliId,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('eperusteet-service.lukiodiplomi-tiedot', moduuliId)
  );
  return data;
};

export const useEPerusteLukiodiplomiTiedot = moduuliId =>
  useApiQuery(
    'getEPerusteLukiodiplomiTiedot',
    getEPerusteLukiodiplomiTiedot,
    {
      moduuliId,
    },
    { ...LONG_CACHE_QUERY_OPTIONS, enabled: Boolean(moduuliId) }
  );

export const useDiplomiKoodiUriToIdMapping = lukiodiplomitData =>
  useMemo(
    () =>
      lukiodiplomitData?.reduce(
        (acc, { id, koodi }) => ({
          ...acc,
          [koodi?.uri]: id,
        }),
        {}
      ),
    [lukiodiplomitData]
  );
