import createOppilaitos from '#/cypress/data/oppilaitos';
import { chooseKieliversiotLanguages, getByTestId } from '#/cypress/utils';
import { stubOppilaitosFormRoutes } from '#/cypress/oppilaitosFormUtils';

const fillKieliversiotSection = () => {
  getByTestId('kieliversiotSection').within(() => {
    chooseKieliversiotLanguages(['fi']);
  });
};

const tallenna = () => {
  getByTestId('tallennaOppilaitosButton').click({ force: true });
};

describe('editOppilaitosForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';

  const oppilaitos = {
    ...createOppilaitos(),
    oid: organisaatioOid,
    organisaatioOid,
  };

  beforeEach(() => {
    cy.server();
    stubOppilaitosFormRoutes({ organisaatioOid });

    cy.route({
      method: 'GET',
      url: `**/oppilaitos/${oppilaitos.oid}`,
      response: oppilaitos,
    });

    cy.visit(`/organisaatio/${organisaatioOid}/oppilaitos`);
  });

  it('should be able to edit oppilaitos', () => {
    cy.route({
      method: 'POST',
      url: '**/oppilaitos',
      response: {},
    }).as('editOppilaitosResponse');

    fillKieliversiotSection();

    tallenna();

    cy.wait('@editOppilaitosResponse').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });
  });
});
