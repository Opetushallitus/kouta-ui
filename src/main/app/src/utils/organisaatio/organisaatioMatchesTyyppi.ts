import _ from 'lodash/fp';

export const getOrganisaatioTyypit = organisaatio =>
  organisaatio?.organisaatiotyypit ?? organisaatio?.tyypit ?? [];

export const organisaatioMatchesTyyppi = _.curry((tyyppi, organisaatio) => {
  const tyypit = getOrganisaatioTyypit(organisaatio);
  return tyypit.includes(tyyppi);
});

export default organisaatioMatchesTyyppi;
