import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';

export const getEPerusteSisalto = async ({
  httpClient,
  apiUrls,
  ePerusteId,
}) => {
  if (ePerusteId) {
    const { data } = await httpClient.get(
      apiUrls.url('eperusteet-service.peruste-sisalto', ePerusteId)
    );

    return data;
  }
};

export const useEPerusteSisalto = ({ ePerusteId }) =>
  useApiQuery('getEPerusteSisalto', { ePerusteId }, getEPerusteSisalto, {
    enabled: Boolean(ePerusteId),
    ...LONG_CACHE_QUERY_OPTIONS,
  });
