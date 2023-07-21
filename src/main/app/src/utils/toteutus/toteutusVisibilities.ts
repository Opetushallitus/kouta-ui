import { KOULUTUSTYYPPI, Koulutustyyppi } from '#/src/constants';
import { KOULUTUSTYYPIT_WITH_HAKEUTUMIS_TAI_ILMOITTAUTUMISTAPA } from '#/src/pages/toteutus/ToteutusForm/ToteutusForm';
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

const KOULUTUSTYYPIT_WITHOUT_ALOITUSPAIKAT: Array<Koulutustyyppi> = [
  KOULUTUSTYYPPI.TAITEEN_PERUSOPETUS,
];

export const isAloituspaikatVisible = (koulutustyyppi: Koulutustyyppi) => {
  return KOULUTUSTYYPIT_WITHOUT_ALOITUSPAIKAT.includes(koulutustyyppi);
};
