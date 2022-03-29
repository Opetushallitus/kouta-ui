import { KORKEAKOULU_KOULUTUSTYYPIT } from '#/src/constants';

const isKorkeakouluKoulutustyyppi = tyyppi => {
  return KORKEAKOULU_KOULUTUSTYYPIT.includes(tyyppi);
};

export default isKorkeakouluKoulutustyyppi;
