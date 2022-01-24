import { useMemo } from 'react';

import _fp from 'lodash/fp';

import {
  EI_TUETUT_KOULUTUSTYYPIT,
  ENTITY,
  ONLY_OPH_CAN_SAVE_KOULUTUS_KOULUTUSTYYPIT,
} from '#/src/constants';
import { useOrganisaatioHierarkia } from '#/src/hooks/useOrganisaatioHierarkia';
import iterateTree from '#/src/utils/iterateTree';

export const useOppilaitosTyypit = organisaatioOid => {
  const { hierarkia, isLoading } = useOrganisaatioHierarkia(organisaatioOid, {
    skipParents: false,
  });

  const oppilaitostyypit = useMemo(() => {
    const tyypit: Array<any> = [];

    iterateTree(hierarkia, org => {
      if (org?.oppilaitostyyppi) {
        tyypit.push(org?.oppilaitostyyppi);
      }
    });
    return tyypit.map(oppilaitostyyppi => oppilaitostyyppi.split('#')[0]);
  }, [hierarkia]);

  return {
    isLoading,
    oppilaitostyypit,
  };
};

export const createIsKoulutustyyppiDisabledGetter = ({
  allowedOppilaitostyypit,
  oppilaitostyypitByKoulutustyypit,
  isOphVirkailija,
  entityType,
}) => {
  return value => {
    if (isOphVirkailija) {
      return false;
    }

    if (
      entityType === ENTITY.KOULUTUS &&
      ONLY_OPH_CAN_SAVE_KOULUTUS_KOULUTUSTYYPIT.includes(value)
    ) {
      return true;
    }

    if (EI_TUETUT_KOULUTUSTYYPIT.includes(value)) {
      return true;
    }

    if (
      _fp.isEmpty(allowedOppilaitostyypit) ||
      _fp.isEmpty(oppilaitostyypitByKoulutustyypit)
    ) {
      return false;
    }

    const oppilaitostyypitForKoulutustyyppiWoVersion =
      oppilaitostyypitByKoulutustyypit.find(
        entry => entry.koulutustyyppi === value
      )?.oppilaitostyypit;

    if (
      !_fp.isEmpty(
        _fp.intersection(
          oppilaitostyypitForKoulutustyyppiWoVersion,
          allowedOppilaitostyypit
        )
      )
    ) {
      return false;
    }

    return true;
  };
};
