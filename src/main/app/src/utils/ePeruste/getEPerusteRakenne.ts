import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';

export const getEPerusteRakenne = async ({
  httpClient,
  apiUrls,
  ePerusteId,
}) => {
  console.log('getEPerusteRakenne');
  if (ePerusteId) {
    const { data } = await httpClient.get(
      apiUrls.url('eperusteet-service.peruste-rakenne', ePerusteId)
    );

    console.log({ data });
    return data;
  }
};

export const useEPerusteRakenne = ({ ePerusteId }) =>
  useApiQuery(
    'getEPerusteRakenne',
    getEPerusteRakenne,
    { ePerusteId },
    {
      enabled: Boolean(ePerusteId),
      ...LONG_CACHE_QUERY_OPTIONS,
    }
  );
