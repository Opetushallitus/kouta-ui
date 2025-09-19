import { OppilaitosModel, OrganisaatioModel } from '#/src/types/domainTypes';

export function enrichOrganisaatiot(
  flatOrgs: Array<OrganisaatioModel>,
  oppilaitokset?: Array<OppilaitosModel>
) {
  const oppilaitoksetJaOsat = oppilaitokset?.flatMap(oppilaitos => [
    oppilaitos,
    ...(oppilaitos.osat ?? []),
  ]);

  return flatOrgs.map(org => {
    const jarjestaaUrheilijanAmmKoulutusta = org.parentOids
      .toReversed()
      .some(parentOid => {
        const oppilaitos = oppilaitoksetJaOsat?.find(
          oppilaitos => oppilaitos.organisaatioOid === parentOid
        );
        return Boolean(oppilaitos?.metadata?.jarjestaaUrheilijanAmmKoulutusta);
      });

    return {
      ...org,
      jarjestaaUrheilijanAmmKoulutusta,
    };
  });
}
