import { TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT } from '#/src/constants';

const isTutkintoonJohtavaAmmatillinenKoulutustyyppi = tyyppi => {
  return TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT.includes(tyyppi);
};

export default isTutkintoonJohtavaAmmatillinenKoulutustyyppi;
