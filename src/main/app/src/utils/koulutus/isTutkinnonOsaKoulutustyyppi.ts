import { KOULUTUSTYYPPI } from '#/src/constants';

const isTutkinnonOsaKoulutustyyppi = tyyppi => {
  return KOULUTUSTYYPPI.TUTKINNON_OSA === tyyppi;
};

export default isTutkinnonOsaKoulutustyyppi;
