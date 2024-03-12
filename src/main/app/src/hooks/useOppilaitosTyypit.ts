import { useMemo } from 'react';

import _fp from 'lodash/fp';

import {
  EI_TUETUT_KOULUTUSTYYPIT,
  ENTITY,
  ONLY_OPH_CAN_SAVE_KOULUTUS_KOULUTUSTYYPIT,
} from '#/src/constants';
import { useOrganisaatioHierarkia } from '#/src/hooks/useOrganisaatioHierarkia';
import iterateTree from '#/src/utils/iterateTree';
import { useOppilaitostyypitByKoulutustyypit } from '#/src/utils/koulutus/getOppilaitostyypitByKoulutustyypit';

import { useIsOphVirkailija } from './useIsOphVirkailija';

export const useOppilaitosTyypit = (
  organisaatioOid,
  options: { enabled?: boolean } = {}
) => {
  const { hierarkia, isLoading } = useOrganisaatioHierarkia(organisaatioOid, {
    skipParents: false,
    enabled: options?.enabled,
  });

  const oppilaitostyypit = useMemo(() => {
    const tyypit: Array<any> = [];

    iterateTree(hierarkia, org => {
      if (org?.oppilaitostyyppiUri) {
        tyypit.push(org?.oppilaitostyyppiUri);
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

export const useIsKoulutustyyppiDisabledGetter = ({
  entityType,
  organisaatioOid,
}) => {
  const isOphVirkailija = useIsOphVirkailija();

  const {
    oppilaitostyypit: allowedOppilaitostyypit,
    isLoading: loadingTyypit,
  } = useOppilaitosTyypit(organisaatioOid, {
    enabled: isOphVirkailija === false,
  });

  const { oppilaitostyypitByKoulutustyypit, isLoading: loadingMappings } =
    useOppilaitostyypitByKoulutustyypit({ enabled: isOphVirkailija === false });

  const getIsDisabled = useMemo(
    () =>
      createIsKoulutustyyppiDisabledGetter({
        isOphVirkailija,
        oppilaitostyypitByKoulutustyypit,
        allowedOppilaitostyypit,
        entityType,
      }),
    [
      isOphVirkailija,
      oppilaitostyypitByKoulutustyypit,
      allowedOppilaitostyypit,
      entityType,
    ]
  );

  return {
    // OPH-pääkäyttäjälle kaikki on sallittua. Ei tarvitse odotella latautumista.
    isLoading: isOphVirkailija ? false : loadingTyypit || loadingMappings,
    getIsDisabled,
  };
};
