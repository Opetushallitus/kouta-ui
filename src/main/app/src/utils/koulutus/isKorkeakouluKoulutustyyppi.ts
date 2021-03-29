import { isTutkintoonJohtavaKorkeakoulutus } from '#/src/utils/koulutus/isTutkintoonJohtavaKorkeakoulutus';

const isKorkeakouluKoulutustyyppi = tyyppi => {
  return isTutkintoonJohtavaKorkeakoulutus(tyyppi);
};

export default isKorkeakouluKoulutustyyppi;
