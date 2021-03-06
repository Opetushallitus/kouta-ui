import _ from 'lodash';

import valintaperuste from '#/cypress/data/valintaperuste';
import {
  getByTestId,
  fillKieliversiotSection,
  tallenna,
  assertNoUnsavedChangesDialog,
} from '#/cypress/utils';
import { stubValintaperusteFormRoutes } from '#/cypress/valintaperusteFormUtils';
import { OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';

const organisaatioOid = '1.1.1.1.1.1';
const valintaperusteId = '1';

const prepareTest = tyyppi => {
  const testValintaperusteFields = {
    organisaatioOid,
  };

  stubValintaperusteFormRoutes({ organisaatioOid });

  cy.intercept(
    { method: 'GET', url: `**/valintaperuste/${valintaperusteId}` },
    { body: _.merge(valintaperuste({ tyyppi }), testValintaperusteFields) }
  );

  cy.visit(
    `/organisaatio/${organisaatioOid}/valintaperusteet/${valintaperusteId}/muokkaus`
  );
};

export const editValintaperusteForm = () => {
  it('should be able to edit valintaperuste', () => {
    prepareTest('amk');
    cy.intercept(
      { method: 'POST', url: '**/valintaperuste' },
      {
        body: {
          muokattu: false,
        },
      }
    ).as('updateValintaperusteRequest');

    getByTestId('postinumero').contains('00350');

    fillKieliversiotSection();
    tallenna();

    cy.wait('@updateValintaperusteRequest').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

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
