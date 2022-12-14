import _fp from 'lodash/fp';

import { valueToArray } from '#/src/utils';

export const getOrganisaatioTyypit = organisaatio =>
  _fp.isEmpty(organisaatio?.organisaatiotyypit)
    ? _fp.isEmpty(organisaatio?.tyypit)
      ? []
      : organisaatio?.tyypit
    : organisaatio?.organisaatiotyypit;

export const organisaatioMatchesTyyppi = _fp.curry((tyyppi, organisaatio) => {
  const tyypit = valueToArray(tyyppi);
  const orgTyypit = getOrganisaatioTyypit(organisaatio);
  return orgTyypit.some(t => tyypit.includes(t));
});
