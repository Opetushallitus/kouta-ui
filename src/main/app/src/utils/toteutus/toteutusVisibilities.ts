import { KOULUTUSTYYPPI } from '#/src/constants';
import parseKoodiUri from '#/src/utils/koodi/parseKoodiUri';
import isKorkeakouluKoulutustyyppi from '#/src/utils/koulutus/isKorkeakouluKoulutustyyppi';

export const isApurahaVisible = (
  koulutustyyppi: KOULUTUSTYYPPI,
  opetuskielet: Array<string> = []
) => {
  const isKorkeakoulu = isKorkeakouluKoulutustyyppi(koulutustyyppi);
  const isEnglishChosen = opetuskielet.some(kieli => {
    const { koodisto, koodiArvo } = parseKoodiUri(kieli);
    return koodisto === 'oppilaitoksenopetuskieli' && koodiArvo === '4';
  });

  return isKorkeakoulu && isEnglishChosen;
};
