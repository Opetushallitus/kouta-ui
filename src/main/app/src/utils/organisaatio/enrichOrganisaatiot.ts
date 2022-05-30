import _ from 'lodash';

export const enrichOrganisaatiot = (orgs, oppilaitokset) => {
  const osat = oppilaitokset?.flatMap(oppilaitos => oppilaitos.osat);

  const enrichedOrgs = orgs.map(org => {
    const osa = _.find(osat, ['oid', org.oid]);

    const jarjestaaUrheilijanAmmKoulutusta =
      osa?.metadata?.jarjestaaUrheilijanAmmKoulutusta;

    return {
      ...org,
      jarjestaaUrheilijanAmmKoulutusta,
    };
  });

  return enrichedOrgs;
};
