import { useMemo } from 'react';

import {
  LONG_CACHE_QUERY_OPTIONS,
  OPETUSHALLITUS_ORGANISAATIO_OID,
} from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import filterTree from '#/src/utils/filterTree';
import getOrganisaatioHierarkia from '#/src/utils/organisaatio/getOrganisaatioHierarkia';

type UseOrganisaatioHierarkiaOptions =
  | {
      skipParents?: boolean;
      filter?: typeof filterTree;
      enabled?: boolean;
    }
  | undefined;

export const useOrganisaatioHierarkia = (
  oid: string,
  {
    skipParents = false,
    filter,
    enabled = true,
  }: UseOrganisaatioHierarkiaOptions = {}
) => {
  const { data, ...rest } = useApiQuery(
    'getOrganisaatioHierarkia',
    getOrganisaatioHierarkia,
    {
      // Jostain syystä organisaatio-servicen hierarkia/v4/hae-rajapinta palauttaa tyhjän taulukon kun antaa
      // oid-parametrina OPH-organisaation, mutta ei kun saman antaa oidRestrictionList-parametrissa.
      ...(oid === OPETUSHALLITUS_ORGANISAATIO_OID ? { oids: [oid] } : { oid }),
      skipParents,
    },
    { ...LONG_CACHE_QUERY_OPTIONS, enabled: Boolean(oid) && enabled }
  );

  const hierarkia = useMemo(() => filterTree(data, filter), [data, filter]);

  return { hierarkia, ...rest };
};

export default useOrganisaatioHierarkia;
