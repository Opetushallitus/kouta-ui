import { LONG_CACHE_QUERY_OPTIONS, JULKAISUTILA } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import getHakukohdeTilaMuutosAllowed from '#/src/utils/hakukohde/getHakukohdeTilaMuutosAllowed';

export const useHakukohdeAllowsPoistettuTila = (hakukohdeOid, options = {}) => {
  const result = useApiQuery(
    'getHakukohdeTilaMuutosAllowed',
    getHakukohdeTilaMuutosAllowed,
    { oid: hakukohdeOid, status: JULKAISUTILA.POISTETTU },
    {
      ...LONG_CACHE_QUERY_OPTIONS,
      enabled: hakukohdeOid !== undefined,
      retry: 0,
      ...options,
    }
  );

  return result;
};

export default useHakukohdeAllowsPoistettuTila;
