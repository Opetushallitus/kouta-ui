import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';

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
    getOsaamisalakuvauksetByEPerusteId,
    { ePerusteId },
    {
      enabled: Boolean(ePerusteId),
      ...LONG_CACHE_QUERY_OPTIONS,
    }
  );
