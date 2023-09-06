import {
  KOULUTUSTYYPIT_WITH_HAKEUTUMIS_TAI_ILMOITTAUTUMISTAPA,
  Koulutustyyppi,
} from '#/src/constants';
import { MaksullisuusTyyppi } from '#/src/types/toteutusTypes';

export const isApurahaVisible = (maksullisuustyyppi: string) => {
  return maksullisuustyyppi === MaksullisuusTyyppi.LUKUVUOSIMAKSU;
};

export const isHakeutumisTaiIlmoittautumisosioVisible = (
  koulutustyyppi: Koulutustyyppi
) => {
  return KOULUTUSTYYPIT_WITH_HAKEUTUMIS_TAI_ILMOITTAUTUMISTAPA.includes(
    koulutustyyppi
  );
};
