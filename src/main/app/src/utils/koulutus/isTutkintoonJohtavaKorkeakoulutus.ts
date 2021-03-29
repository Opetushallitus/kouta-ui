import { TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT } from '#/src/constants';

const isTutkintoonJohtavaKorkeakoulutus = tyyppi => {
  return TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT.includes(tyyppi);
};

export default isTutkintoonJohtavaKorkeakoulutus;
