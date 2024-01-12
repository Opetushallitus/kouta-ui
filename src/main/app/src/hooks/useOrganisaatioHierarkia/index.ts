import { useMemo } from 'react';

import _fp from 'lodash/fp';

import {
  LONG_CACHE_QUERY_OPTIONS,
  OPETUSHALLITUS_ORGANISAATIO_OID,
  ORGANISAATIOTYYPPI,
} from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import { Organisaatio } from '#/src/types/domainTypes';
import { oneAndOnlyOne } from '#/src/utils';
import filterTree from '#/src/utils/filterTree';
import getOrganisaatioHierarkia from '#/src/utils/organisaatio/getOrganisaatioHierarkia';

type UseOrganisaatioHierarkiaOptions =
  | {
      skipParents?: boolean;
      filter?: (org: any) => boolean;
      enabled?: boolean;
    }
  | undefined;

export const defaultFilter = (org: Organisaatio) => {
  const organisaatiotyypit = org?.organisaatiotyyppiUris;

  const onlyOrganisaatiotyyppi = oneAndOnlyOne(organisaatiotyypit);

  return ![
    ORGANISAATIOTYYPPI.VARHAISKASVATUKSEN_JARJESTAJA,
    ORGANISAATIOTYYPPI.VARHAISKASVATUKSEN_TOIMIPAIKKA,
  ].includes(onlyOrganisaatiotyyppi);
};

export const useOrganisaatioHierarkia = (
  oid?: string | Array<string>,
  {
    skipParents = false,
    filter = _fp.T,
    enabled = true,
  }: UseOrganisaatioHierarkiaOptions = {}
) => {
  const oidsParams = _fp.isArray(oid)
    ? {
        oids: oid,
      }
    : oid === OPETUSHALLITUS_ORGANISAATIO_OID
    ? {}
    : { oid };

  const { data, ...rest } = useApiQuery(
    'getOrganisaatioHierarkia',
    getOrganisaatioHierarkia,
    {
      // Jostain syystä organisaatio-servicen hierarkia/v4/hae-rajapinta palauttaa tyhjän taulukon kun antaa
      // oid-parametrina OPH-organisaation. Jos ei anna oidia, niin palautetaan kaikki muut paitsi OPH
      ...oidsParams,
      skipParents,
    },
    { ...LONG_CACHE_QUERY_OPTIONS, enabled: Boolean(oid) && enabled }
  );

  const hierarkia = useMemo(
    () => filterTree(data, org => defaultFilter(org) && filter(org)),
    [data, filter]
  );

  return { hierarkia, ...rest };
};

export default useOrganisaatioHierarkia;
