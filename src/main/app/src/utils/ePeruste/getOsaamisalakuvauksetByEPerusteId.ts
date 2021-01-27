import { useApiQuery } from '#/src/hooks/useApiQuery';
import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';

export const getOsaamisalakuvauksetByEPerusteId = async ({
  httpClient,
  apiUrls,
  ePerusteId,
}) => {
  if (ePerusteId) {
    const { data } = await httpClient.get(
      apiUrls.url('eperusteet-service.osaamisalakuvaukset', ePerusteId)
    );

    return data?.reformi ?? {};
  }
};

export const useEPerusteOsaamisalaKuvaukset = ({ ePerusteId }) =>
  useApiQuery(
    'getOsaamisalakuvauksetByEPerusteId',
    { ePerusteId },
    getOsaamisalakuvauksetByEPerusteId,
    {
      enabled: Boolean(ePerusteId),
      ...LONG_CACHE_QUERY_OPTIONS,
    }
  );
