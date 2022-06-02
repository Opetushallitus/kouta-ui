import _ from 'lodash';

export const enrichOrganisaatiot = (orgs, oppilaitokset) => {
  const osat = oppilaitokset?.flatMap(oppilaitos => oppilaitos.osat);

  return orgs.map(org => {
    const osa = _.find(osat, ['oid', org.oid]);

    return {
      ...org,
      jarjestaaUrheilijanAmmKoulutusta:
        osa?.metadata?.jarjestaaUrheilijanAmmKoulutusta,
    };
  });
};
