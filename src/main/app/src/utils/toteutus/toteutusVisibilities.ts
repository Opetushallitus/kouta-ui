import { KOULUTUSTYYPPI } from '#/src/constants';
import { MaksullisuusTyyppi } from '#/src/types/toteutusTypes';
import parseKoodiUri from '#/src/utils/koodi/parseKoodiUri';
import isKorkeakouluKoulutustyyppi from '#/src/utils/koulutus/isKorkeakouluKoulutustyyppi';

export const isApurahaVisible = (
  koulutustyyppi: KOULUTUSTYYPPI,
  opetuskielet: Array<string> = [],
  maksullisuustyyppi: string
) => {
  const isLukuvuosimaksu =
    maksullisuustyyppi === MaksullisuusTyyppi.LUKUVUOSIMAKSU;
  const isKorkeakoulu = isKorkeakouluKoulutustyyppi(koulutustyyppi);
  const isEnglishChosen = opetuskielet.some(kieli => {
    const { koodisto, koodiArvo } = parseKoodiUri(kieli);
    return koodisto === 'oppilaitoksenopetuskieli' && koodiArvo === '4';
  });

  return isKorkeakoulu && isLukuvuosimaksu && isEnglishChosen;
};
