import { TUTKINTOON_JOHTAVAT_KOULUTUSTYYPIT } from '../constants';

const isTutkintoonJohtavaKoulutustyyppi = tyyppi => {
  return TUTKINTOON_JOHTAVAT_KOULUTUSTYYPIT.includes(tyyppi);
};

export default isTutkintoonJohtavaKoulutustyyppi;
