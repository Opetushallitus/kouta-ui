import {
  KOULUTUSTYYPIT,
  TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
} from '#/src/constants';
import parseKoodiUri from '#/src/utils/koodi/parseKoodiUri';

type KoulutusTyyppi = typeof KOULUTUSTYYPIT[0];

export const isStipendiVisible = (
  koulutustyyppi: KoulutusTyyppi,
  opetuskielet: Array<string> = []
) => {
  const isKorkeakoulu = TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT.some(
    t => t === koulutustyyppi
  );
  const isEnglishChosen = opetuskielet.some(kieli => {
    const { koodisto, koodiArvo } = parseKoodiUri(kieli);
    return koodisto === 'oppilaitoksenopetuskieli' && koodiArvo === '4';
  });

  return isKorkeakoulu && isEnglishChosen;
};
