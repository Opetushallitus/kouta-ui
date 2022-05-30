import _ from 'lodash';

export const enrichOrganisaatiot = (orgs, oppilaitokset) => {
  const enrichedOrgs = orgs.map(org => {
    const oid = org.oid;
    const oppilaitos = _.find(oppilaitokset, ['oid', oid]);
    if (oppilaitos) {
      const oppilaitoksenOsa = _.find(oppilaitos?.oppilaitos?.osat, [
        'oid',
        oid,
      ]);

      if (oppilaitoksenOsa) {
        const jarjestaaUrheilijanAmmKoulutusta =
          oppilaitoksenOsa.metadata?.jarjestaaUrheilijanAmmKoulutusta;
        org['jarjestaaUrheilijanAmmKoulutusta'] =
          jarjestaaUrheilijanAmmKoulutusta;
      }
    }
    return org;
  });

  return enrichedOrgs;
};
