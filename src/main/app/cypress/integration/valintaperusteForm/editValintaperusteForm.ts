import { merge } from 'lodash/fp';

import valintaperuste from '#/cypress/data/valintaperuste';
import {
  getByTestId,
  fillKieliversiotSection,
  tallenna,
  assertNoUnsavedChangesDialog,
  wrapMutationTest,
  fillTilaSection,
  confirmDelete,
} from '#/cypress/utils';
import { stubValintaperusteFormRoutes } from '#/cypress/valintaperusteFormUtils';
import { ENTITY, OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';

const organisaatioOid = '1.1.1.1.1.1';
const valintaperusteId = '1';

const prepareTest = tyyppi => {
  const testValintaperusteFields = {
    organisaatioOid,
  };

  stubValintaperusteFormRoutes({ organisaatioOid });

  cy.intercept(
    { method: 'GET', url: `**/valintaperuste/${valintaperusteId}` },
    { body: merge(valintaperuste({ tyyppi }), testValintaperusteFields) }
  );

  cy.visit(
    `/organisaatio/${organisaatioOid}/valintaperusteet/${valintaperusteId}/muokkaus`
  );
};

export const editValintaperusteForm = () => {
  const mutationTest = wrapMutationTest({
    id: valintaperusteId,
    entity: ENTITY.VALINTAPERUSTE,
  });

  it(
    'should be able to edit valintaperuste',
    mutationTest(() => {
      prepareTest('amk');

      getByTestId('postinumero').contains('00350');

      fillKieliversiotSection();
      tallenna();
    })
  );

  it(
    'should be able to delete valintaperuste',
    mutationTest(() => {
      prepareTest('amk');

      fillKieliversiotSection();
      fillTilaSection('poistettu');

      tallenna();
      confirmDelete();
    })
  );

  it("Shouldn't complain about unsaved changes for untouched amm-form", () => {
    prepareTest('amm');
    assertNoUnsavedChangesDialog();
  });

  it("Shouldn't complain about unsaved changes for untouched amk-form", () => {
    prepareTest('amk');
    assertNoUnsavedChangesDialog();
  });

  it('Should redirect from url without organization', () => {
    prepareTest('amm');
    cy.visit(`/valintaperusteet/${valintaperusteId}/muokkaus`);
    cy.url().should(
      'include',
      `/organisaatio/${OPETUSHALLITUS_ORGANISAATIO_OID}/valintaperusteet/${valintaperusteId}/muokkaus`
    );
  });
};
