import { TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT } from '../constants';

const isTutkintoonJohtavaKorkeakouluKoulutustyyppi = tyyppi => {
  return TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT.includes(tyyppi);
};

export default isTutkintoonJohtavaKorkeakouluKoulutustyyppi;
