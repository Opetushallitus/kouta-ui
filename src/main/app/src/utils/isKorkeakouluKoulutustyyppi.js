import { KORKEAKOULUKOULUTUSTYYPIT } from '../constants';

const isKorkeakouluKoulutustyyppi = value => {
  return KORKEAKOULUKOULUTUSTYYPIT.includes(value);
};

export default isKorkeakouluKoulutustyyppi;
