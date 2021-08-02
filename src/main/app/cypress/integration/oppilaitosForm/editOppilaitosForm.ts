import createOppilaitos from '#/cypress/data/oppilaitos';
import { stubOppilaitosFormRoutes } from '#/cypress/oppilaitosFormUtils';
import {
  assertNoUnsavedChangesDialog,
  fillKieliversiotSection,
  tallenna,
  wrapMutationTest,
} from '#/cypress/utils';
import { ENTITY } from '#/src/constants';

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

  const mutationTest = wrapMutationTest({
    oid: organisaatioOid,
    entity: ENTITY.OPPILAITOS,
  });

  it(
    'should be able to edit oppilaitos',
    mutationTest(() => {
      fillKieliversiotSection();

      tallenna();
    })
  );

  it("Shouldn't complain about unsaved changes for untouched form", () => {
    assertNoUnsavedChangesDialog();
  });
};
