import _fp from 'lodash/fp';

import { valueToArray } from '#/src/utils';

export const getOrganisaatioTyypit = organisaatio =>
  organisaatio?.organisaatiotyypit ?? organisaatio?.tyypit ?? [];

export const organisaatioMatchesTyyppi = _fp.curry((tyyppi, organisaatio) => {
  const tyypit = valueToArray(tyyppi);
  const orgTyypit = getOrganisaatioTyypit(organisaatio);
  return orgTyypit.some(t => tyypit.includes(t));
});

export default organisaatioMatchesTyyppi;
