import {
  KOULUTUSTYYPPI,
  TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
} from '#/src/constants';

export const isTutkintoonJohtavaKorkeakoulutus = (tyyppi?: KOULUTUSTYYPPI) => {
  return TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT.includes(
    tyyppi as KOULUTUSTYYPPI
  );
};
