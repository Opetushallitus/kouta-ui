import { KOULUTUSTYYPPI } from '#/src/constants';
import { MaksullisuusTyyppi } from '#/src/types/toteutusTypes';
import parseKoodiUri from '#/src/utils/koodi/parseKoodiUri';
import { isTutkintoonJohtavaKorkeakoulutus } from '#/src/utils/koulutus/isTutkintoonJohtavaKorkeakoulutus';

export const isApurahaVisible = (
  koulutustyyppi: KOULUTUSTYYPPI,
  opetuskielet: Array<string> = [],
  maksullisuustyyppi: string
) => {
  const isLukuvuosimaksu =
    maksullisuustyyppi === MaksullisuusTyyppi.LUKUVUOSIMAKSU;
  const isTutkintoonJohtavaKorkeakoulu =
    isTutkintoonJohtavaKorkeakoulutus(koulutustyyppi);
  const isEnglishChosen = opetuskielet.some(kieli => {
    const { koodisto, koodiArvo } = parseKoodiUri(kieli);
    return koodisto === 'oppilaitoksenopetuskieli' && koodiArvo === '4';
  });

  return isTutkintoonJohtavaKorkeakoulu && isLukuvuosimaksu && isEnglishChosen;
};
