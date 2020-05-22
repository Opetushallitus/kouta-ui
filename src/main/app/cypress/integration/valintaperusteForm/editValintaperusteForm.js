import { merge } from 'lodash';

import { chooseKieliversiotLanguages, getByTestId } from '#/cypress/utils';
import valintaperuste from '#/cypress/data/valintaperuste';
import { stubValintaperusteFormRoutes } from '#/cypress/valintaperusteFormUtils';

const fillKieliversiotSection = () => {
  getByTestId('kieliversiotSection').within(() => {
    chooseKieliversiotLanguages(['fi']);
  });
};

const tallenna = () => {
  getByTestId('tallennaValintaperusteButton').click({ force: true });
};

const prepareTest = tyyppi => {
  const organisaatioOid = '1.1.1.1.1.1';
  const valintaperusteId = '1';

  const testValintaperusteFields = {
    organisaatioOid,
  };

  cy.server();

  stubValintaperusteFormRoutes({ organisaatioOid });

  cy.route({
    method: 'GET',
    url: `**/valintaperuste/${valintaperusteId}`,
    response: merge(valintaperuste({ tyyppi }), testValintaperusteFields),
  });

  cy.visit(
    `/organisaatio/${organisaatioOid}/valintaperusteet/${valintaperusteId}/muokkaus`
  );
};

describe('editValintaperusteForm', () => {
  it('should be able to edit valintaperuste', () => {
    prepareTest('amm');
    cy.route({
      method: 'POST',
      url: '**/valintaperuste',
      response: {
        muokattu: false,
      },
    }).as('updateValintaperusteRequest');

    getByTestId('postinumero').contains('00350');

    fillKieliversiotSection();
    tallenna();

    cy.wait('@updateValintaperusteRequest').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });
  });
});
