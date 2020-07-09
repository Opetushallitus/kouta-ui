import { get } from 'lodash';

const organisaatioMatchesTyyppi = tyyppi => organisaatio => {
  const tyypit =
    get(organisaatio, 'organisaatiotyypit') ||
    get(organisaatio, 'tyypit') ||
    [];

  return tyypit.includes(tyyppi);
};

export default organisaatioMatchesTyyppi;
