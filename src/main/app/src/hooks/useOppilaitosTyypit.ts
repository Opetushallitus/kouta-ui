import _fp from 'lodash/fp';

import {
  AMMATILLISET_OPPILAITOSTYYPIT,
  KORKEAKOULU_KOULUTUSTYYPIT,
  KORKEAKOULU_OPPILAITOSTYYPIT,
  KOULUTUSTYYPPI,
  LUKIO_OPPILAITOSTYYPIT,
} from '#/src/constants';
import { useOrganisaatioHierarkia } from '#/src/hooks/useOrganisaatioHierarkia';
import iterateTree from '#/src/utils/iterateTree';

export const useOppilaitosTyypit = organisaatioOid => {
  const { hierarkia, isLoading } = useOrganisaatioHierarkia(organisaatioOid, {
    skipParents: false,
  });

  const oppilaitosTyypit: Array<any> = [];

  iterateTree(hierarkia, org => {
    if (org?.oppilaitostyyppi) {
      oppilaitosTyypit.push(org?.oppilaitostyyppi);
    }
  });

  const isAmmatillinen = !_fp.isEmpty(
    _fp.intersection(AMMATILLISET_OPPILAITOSTYYPIT, oppilaitosTyypit)
  );

  const isKorkeakoulutus = !_fp.isEmpty(
    _fp.intersection(KORKEAKOULU_OPPILAITOSTYYPIT, oppilaitosTyypit)
  );

  const isLukio = !_fp.isEmpty(
    _fp.intersection(LUKIO_OPPILAITOSTYYPIT, oppilaitosTyypit)
  );

  return { isAmmatillinen, isKorkeakoulutus, isLukio, isLoading };
};

export const createIsKoulutustyyppiDisabledGetter =
  ({ isOphVirkailija, isAmmatillinen, isKorkeakoulutus, isLukio }) =>
  value => {
    if (isOphVirkailija) {
      return false;
    }

    // Don't disable anything, if not detecting any oppilaitos tyyppi
    if (!isLukio && !isAmmatillinen && !isKorkeakoulutus) {
      return false;
    }

    // Lukio koulutustyyppi disabled for all except OPH
    if (isLukio && !isAmmatillinen && !isKorkeakoulutus) {
      return true;
    }

    let isDisabled = true;
    // Allow "amm" and "kk" to coexist so that koulutustyyppis for both will
    // be enabled if both types of oppilaitos found.
    if (
      isAmmatillinen &&
      [
        KOULUTUSTYYPPI.TUTKINNON_OSA,
        KOULUTUSTYYPPI.OSAAMISALA,
        KOULUTUSTYYPPI.MUUT_KOULUTUKSET,
      ].includes(value)
    ) {
      isDisabled = false;
    }

    if (isKorkeakoulutus && KORKEAKOULU_KOULUTUSTYYPIT.includes(value)) {
      isDisabled = false;
    }

    return isDisabled;
  };
