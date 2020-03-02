import { get } from 'lodash';

const organisaatioIsOppilaitos = organisaatio => {
  const tyypit =
    get(organisaatio, 'organisaatiotyypit') ||
    get(organisaatio, 'tyypit') ||
    [];

  return tyypit.includes('organisaatiotyyppi_02');
};

export default organisaatioIsOppilaitos;
