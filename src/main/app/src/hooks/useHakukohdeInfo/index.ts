import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import getHakemuspalveluHakukohdeInfo from '#/src/utils/hakemuspalvelu/getHakemuspalveluHakukohdeInfo';

export const useHakukohdeInfo = (hakukohdeOid, options = {}) => {
  const result = useApiQuery(
    'getHakemuspalveluHakukohdeInfo',
    getHakemuspalveluHakukohdeInfo,
    { hakukohdeOid: hakukohdeOid },
    {
      ...LONG_CACHE_QUERY_OPTIONS,
      enabled: hakukohdeOid !== undefined,
      retry: 0,
      ...options,
    }
  );

  return result;
};

export default useHakukohdeInfo;
