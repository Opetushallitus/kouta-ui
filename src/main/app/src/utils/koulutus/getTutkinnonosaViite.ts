import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
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

export const useEPerusteTutkinnonOsat = ({ ePerusteId }) => {
  return useApiQuery(
    'getTutkinnonOsaViite',
    getEPerusteTutkinnonOsat,
    { ePerusteId },
    {
      enabled: Boolean(ePerusteId),
      ...LONG_CACHE_QUERY_OPTIONS,
    }
  );
};
