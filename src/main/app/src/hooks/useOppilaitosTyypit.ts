import _fp from 'lodash/fp';

import {
  AMMATILLISET_OPPILAITOSTYYPIT,
  EI_TUETUT_KOULUTUSTYYPIT,
  ENTITY,
  KORKEAKOULU_OPPILAITOSTYYPIT,
  LUKIO_OPPILAITOSTYYPIT,
  OPPILAITOSTYYPPI_TO_KOULUTUSTYYPIT,
  ONLY_OPH_CAN_SAVE_KOULUTUS_KOULUTUSTYYPIT,
} from '#/src/constants';
import { useOrganisaatioHierarkia } from '#/src/hooks/useOrganisaatioHierarkia';
import iterateTree from '#/src/utils/iterateTree';
import { reduce } from '#/src/utils/lodashFpUncapped';

export const useOppilaitosTyypit = organisaatioOid => {
  const { hierarkia, isLoading } = useOrganisaatioHierarkia(organisaatioOid, {
    skipParents: false,
  });

  const oppilaitostyypit: Array<any> = [];

  iterateTree(hierarkia, org => {
    if (org?.oppilaitostyyppi) {
      oppilaitostyypit.push(org?.oppilaitostyyppi);
    }
  });

  const isAmmatillinen = !_fp.isEmpty(
    _fp.intersection(AMMATILLISET_OPPILAITOSTYYPIT, oppilaitostyypit)
  );

  const isKorkeakoulutus = !_fp.isEmpty(
    _fp.intersection(KORKEAKOULU_OPPILAITOSTYYPIT, oppilaitostyypit)
  );

  const isLukio = !_fp.isEmpty(
    _fp.intersection(LUKIO_OPPILAITOSTYYPIT, oppilaitostyypit)
  );

  return {
    isAmmatillinen,
    isKorkeakoulutus,
    isLukio,
    isLoading,
    oppilaitostyypit,
  };
};

const KOULUTUSTYYPPI_TO_OPPILAITOSTYYPIT = reduce(
  (result, koulutustyypit, oppilaitostyyppi) => {
    koulutustyypit?.forEach(koulutustyyppi => {
      if (!result[koulutustyyppi]) {
        result[koulutustyyppi] = [];
      }
      result[koulutustyyppi].push(oppilaitostyyppi);
    });
    return result;
  },
  {},
  OPPILAITOSTYYPPI_TO_KOULUTUSTYYPIT
);

export const createIsKoulutustyyppiDisabledGetter = ({
  oppilaitostyypit,
  isOphVirkailija,
  entityType,
}) => {
  const oppilaitostyypitWithoutVersion = oppilaitostyypit.map(
    oppilaitostyyppi => oppilaitostyyppi.split('#')[0]
  );

  return value => {
    if (EI_TUETUT_KOULUTUSTYYPIT.includes(value)) {
      return true;
    }

    if (isOphVirkailija) {
      return false;
    }

    if (
      entityType === ENTITY.KOULUTUS &&
      ONLY_OPH_CAN_SAVE_KOULUTUS_KOULUTUSTYYPIT.includes(value)
    ) {
      return true;
    }

    const oppilaitostyypitForKoulutustyyppi =
      KOULUTUSTYYPPI_TO_OPPILAITOSTYYPIT[value] || [];

    if (_fp.isEmpty(oppilaitostyypitWithoutVersion)) {
      return false;
    }

    if (
      !_fp.isEmpty(
        _fp.intersection(
          oppilaitostyypitForKoulutustyyppi,
          oppilaitostyypitWithoutVersion
        )
      )
    ) {
      return false;
    }

    return true;
  };
};
