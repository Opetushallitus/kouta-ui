import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';

export const getEPerusteById = async ({ httpClient, apiUrls, ePerusteId }) => {
  if (ePerusteId) {
    const { data } = await httpClient.get(
      apiUrls.url('eperusteet-service.peruste-by-id', ePerusteId)
    );

    return data;
  }
};

export const useEPerusteById = ePerusteId =>
  useApiQuery(
    'getEPerusteById',
    getEPerusteById,
    {
      ePerusteId,
    },
    {
      enabled: Boolean(ePerusteId),
      ...LONG_CACHE_QUERY_OPTIONS,
    }
  );
