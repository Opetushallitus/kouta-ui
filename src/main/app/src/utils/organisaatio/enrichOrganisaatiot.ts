import _ from 'lodash';

export const enrichOrganisaatiot = (orgs, oppilaitokset) => {
  const enrichedOrgs = orgs.map(org => {
    const oid = org.oid;
    const oppilaitos = _.find(oppilaitokset, ['oid', oid]);
    if (oppilaitos) {
      const jarjestaaUrheilijanAmmKoulutusta = _.find(
        oppilaitos?.oppilaitos?.osat,
        ['oid', oid]
      ).metadata?.jarjestaaUrheilijanAmmKoulutusta;

      org['jarjestaaUrheilijanAmmKoulutusta'] =
        jarjestaaUrheilijanAmmKoulutusta;
    }
    return org;
  });


  console.log({enrichedOrgs})
  return enrichedOrgs;
};
