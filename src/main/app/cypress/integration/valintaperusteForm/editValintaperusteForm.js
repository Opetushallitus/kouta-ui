import { merge } from 'lodash';

import { chooseKieliversiotLanguages } from '../../utils';
import valintaperuste from '../../data/valintaperuste';
import { stubValintaperusteFormRoutes } from '../../valintaperusteFormUtils';

const fillKieliversiotSection = () => {
  cy.getByTestId('kieliversiotSection').within(() => {
    chooseKieliversiotLanguages(['fi'], cy);
  });
};

const tallenna = () => {
  cy.getByTestId('tallennaValintaperusteButton').click({ force: true });
};

const prepareTest = tyyppi => {
  const organisaatioOid = '1.1.1.1.1.1';
  const valintaperusteId = '1';

  const testValintaperusteFields = {
    organisaatioOid,
  };

  stubValintaperusteFormRoutes({ cy, organisaatioOid });

  cy.route({
    method: 'GET',
    url: `**/valintaperuste/${valintaperusteId}`,
    response: merge(valintaperuste({ tyyppi }), testValintaperusteFields),
  });

  cy.visit(
    `/organisaatio/${organisaatioOid}/valintaperusteet/${valintaperusteId}/muokkaus`,
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

    cy.getByTestId('postinumero').contains('00350');

    fillKieliversiotSection();
    tallenna();

    cy.wait('@updateValintaperusteRequest').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });
  });
});
