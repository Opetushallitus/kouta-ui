import { isArray, some } from 'lodash';

import {
  KOULUTUSTYYPIT_WITH_HAKEUTUMIS_TAI_ILMOITTAUTUMISTAPA,
  Koulutustyyppi,
} from '#/src/constants';
import { MaksullisuusTyyppi } from '#/src/types/toteutusTypes';
import { isTutkintoonJohtavaKorkeakoulutus } from '#/src/utils/koulutus/isTutkintoonJohtavaKorkeakoulutus';

export const isApurahaVisible = (
  koulutustyyppi: string,
  maksullisuustyyppi?: string | Array<string>
) => {
  const maksullisuustyyppiArray = isArray(maksullisuustyyppi)
    ? maksullisuustyyppi
    : [maksullisuustyyppi];

  return (
    some(
      maksullisuustyyppiArray,
      mt => mt === MaksullisuusTyyppi.LUKUVUOSIMAKSU
    ) && isTutkintoonJohtavaKorkeakoulutus(koulutustyyppi)
  );
};

export const isHakeutumisTaiIlmoittautumisosioVisible = (
  koulutustyyppi: Koulutustyyppi
) => {
  return KOULUTUSTYYPIT_WITH_HAKEUTUMIS_TAI_ILMOITTAUTUMISTAPA.includes(
    koulutustyyppi
  );
};
