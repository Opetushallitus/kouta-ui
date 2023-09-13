import _ from 'lodash';

export const enrichOrganisaatiot = (orgs, oppilaitokset) => {
  const osat = oppilaitokset?.flatMap(oppilaitos => oppilaitos.osat);

  return orgs.map(org => {
    const oppilaitosOrOsa =
      _.find(osat, ['oid', org.oid]) || _.find(oppilaitokset, ['oid', org.oid]);

    return {
      ...org,
      jarjestaaUrheilijanAmmKoulutusta:
        oppilaitosOrOsa?.metadata?.jarjestaaUrheilijanAmmKoulutusta,
    };
  });
};
