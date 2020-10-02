import { EPERUSTE_SERVICE_QUERY_OPTIONS } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';

export const getEPerusteTutkinnonOsat = async ({
  httpClient,
  apiUrls,
  ePerusteId,
}) => {
  if (ePerusteId) {
    const response = await httpClient.get(
      apiUrls.url('eperusteet-service.peruste-tutkinnonosat', ePerusteId)
    );

    return response?.data;
  }
};

export const useEPerusteTutkinnonOsat = props => {
  return useApiQuery(
    'getTutkinnonOsaViite',
    props,
    getEPerusteTutkinnonOsat,
    EPERUSTE_SERVICE_QUERY_OPTIONS
  );
};
