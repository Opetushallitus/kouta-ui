import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';

export const getOsaamismerkkiById = async ({
  httpClient,
  apiUrls,
  osaamismerkkiId,
}) => {
  if (osaamismerkkiId) {
    const { data } = await httpClient.get(
      apiUrls.url('eperusteet-service.osaamismerkki', osaamismerkkiId)
    );

    return data;
  }
};

export const useOsaamismerkkiById = (osaamismerkkiId: string | undefined) =>
  useApiQuery(
    'getOsaamismerkkiById',
    getOsaamismerkkiById,
    {
      osaamismerkkiId,
    },
    {
      enabled: Boolean(osaamismerkkiId),
      ...LONG_CACHE_QUERY_OPTIONS,
    }
  );
