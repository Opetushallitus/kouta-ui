import createOppilaitos from '#/cypress/data/oppilaitos';
import { stubOppilaitosFormRoutes } from '#/cypress/oppilaitosFormUtils';
import {
  assertNoUnsavedChangesDialog,
  fillKieliversiotSection,
  tallenna,
} from '#/cypress/utils';

export const editOppilaitosForm = () => {
  const organisaatioOid = '1.1.1.1.1.1';

  const oppilaitos = {
    ...createOppilaitos(),
    oid: organisaatioOid,
    organisaatioOid,
  };

  beforeEach(() => {
    stubOppilaitosFormRoutes({ organisaatioOid });

    cy.intercept(
      { method: 'GET', url: `**/oppilaitos/${oppilaitos.oid}` },
      { body: oppilaitos }
    );

    cy.visit(`/organisaatio/${organisaatioOid}/oppilaitos`);
  });

  it('should be able to edit oppilaitos', () => {
    cy.intercept({ method: 'POST', url: '**/oppilaitos' }, { body: {} }).as(
      'editOppilaitosResponse'
    );

    fillKieliversiotSection();

    tallenna();

    cy.wait('@editOppilaitosResponse').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

  it("Shouldn't complain about unsaved changes for untouched form", () => {
    assertNoUnsavedChangesDialog();
  });
};
