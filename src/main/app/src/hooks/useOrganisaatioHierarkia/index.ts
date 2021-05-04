import { useMemo } from 'react';

import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import filterTree from '#/src/utils/filterTree';
import getOrganisaatioHierarkiaByOid from '#/src/utils/organisaatio/getOrganisaatioHierarkiaByOid';

type UseOrganisaatioHierarkiaOptions =
  | {
      skipParents?: boolean;
      filter?: typeof filterTree;
    }
  | undefined;

export const useOrganisaatioHierarkia = (
  oid: string,
  { skipParents = false, filter }: UseOrganisaatioHierarkiaOptions = {}
) => {
  const { data, ...rest } = useApiQuery(
    'getOrganisaatioHierarkiaByOid',
    getOrganisaatioHierarkiaByOid,
    {
      promiseFn: getOrganisaatioHierarkiaByOid,
      oid,
      skipParents,
    },
    { ...LONG_CACHE_QUERY_OPTIONS, enabled: Boolean(oid) }
  );

  const hierarkia = useMemo(() => filterTree(data, filter), [data, filter]);

  return { hierarkia, ...rest };
};

export default useOrganisaatioHierarkia;
