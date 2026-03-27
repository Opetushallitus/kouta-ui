import {
  KOULUTUSTYYPIT_WITH_HAKEUTUMIS_TAI_ILMOITTAUTUMISTAPA,
  Koulutustyyppi,
} from '#/src/constants';
import { MaksullisuusTyyppi } from '#/src/types/toteutusTypes';
import { isTutkintoonJohtavaKorkeakoulutus } from '#/src/utils/koulutus/isTutkintoonJohtavaKorkeakoulutus';

export const isApurahaVisible = (
  maksullisuustyyppi: string,
  koulutustyyppi: string
) => {
  return (
    maksullisuustyyppi === MaksullisuusTyyppi.LUKUVUOSIMAKSU &&
    isTutkintoonJohtavaKorkeakoulutus(koulutustyyppi)
  );
};

export const isHakeutumisTaiIlmoittautumisosioVisible = (
  koulutustyyppi: Koulutustyyppi
) => {
  return KOULUTUSTYYPIT_WITH_HAKEUTUMIS_TAI_ILMOITTAUTUMISTAPA.includes(
    koulutustyyppi
  );
};
