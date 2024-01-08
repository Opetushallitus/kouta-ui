import { useMemo } from 'react';

import _ from 'lodash';

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

    return (
      organisaatiot
        .filter(org => {
          const isSelected = value.includes(org.oid);

          if (
            isSelected &&
            organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.KOULUTUSTOIMIJA)(org)
          ) {
            selectedKoulutustoimijaOids.push(org.oid);
          }

          return naytaVainValitut
            ? isSelected
            : isSelected ||
                organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.OPPILAITOS)(org);
        })
        // Olemassaolevissa tarjoajissa on tallennettuna myös koulutustoimijoita.
        // Näytetään koulutustoimija silloin kun se on valittu, jotta valinnan voi poistaa.
        .filter(org => {
          if (_.isEmpty(selectedKoulutustoimijaOids)) {
            return true;
          } else {
            return (
              organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.KOULUTUSTOIMIJA)(
                org
              ) ||
              !selectedKoulutustoimijaOids.some(
                ktOid => org?.parentOids?.includes(ktOid)
              )
            );
          }
        })
    );
  }, [organisaatiot, value, naytaVainValitut]);
};
