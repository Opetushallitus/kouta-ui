import { useApiQuery } from '#/src/hooks/useApiQuery';
import { EPERUSTE_SERVICE_QUERY_OPTIONS } from '#/src/constants';

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

export const useEPerusteSisalto = props =>
  useApiQuery(
    'getEPerusteSisalto',
    props,
    getEPerusteSisalto,
    EPERUSTE_SERVICE_QUERY_OPTIONS
  );
