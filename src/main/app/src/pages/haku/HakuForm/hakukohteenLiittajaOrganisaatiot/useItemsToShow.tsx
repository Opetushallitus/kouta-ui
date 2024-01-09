import { useMemo } from 'react';

import { isEmpty } from 'lodash';

import { ORGANISAATIOTYYPPI } from '#/src/constants';
import { Organisaatio } from '#/src/types/domainTypes';
import { organisaatioMatchesTyyppi } from '#/src/utils/organisaatio/organisaatioMatchesTyyppi';

type Props = {
  organisaatiot: Array<Organisaatio>;
  value: Array<string>;
  naytaVainValitut: boolean;
};

export const useItemsToShow = ({
  organisaatiot,
  value,
  naytaVainValitut,
}: Props) => {
  return useMemo(() => {
    const selectedKoulutustoimijaOids: Array<string> = [];

    return organisaatiot
      .filter(org => {
        const orgOid = org.oid ?? '';
        const isSelected = value.includes(orgOid);

        if (
          isSelected &&
          organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.KOULUTUSTOIMIJA)(org)
        ) {
          selectedKoulutustoimijaOids.push(orgOid);
        }

        return naytaVainValitut
          ? isSelected
          : isSelected ||
              organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.OPPILAITOS)(org);
      })
      .filter(org => {
        if (isEmpty(selectedKoulutustoimijaOids)) {
          return true;
        } else {
          return (
            organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.KOULUTUSTOIMIJA)(
              org
            ) ||
            !selectedKoulutustoimijaOids.some(ktOid =>
              (org?.parentOidPath ?? '').includes(ktOid)
            )
          );
        }
      });
  }, [organisaatiot, value, naytaVainValitut]);
};
