import { TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT } from '#/src/constants';

export const isTutkintoonJohtavaKorkeakoulutus = tyyppi => {
  return TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT.includes(tyyppi);
};
