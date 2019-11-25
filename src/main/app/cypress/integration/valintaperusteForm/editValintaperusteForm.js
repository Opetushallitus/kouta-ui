import merge from 'lodash/merge';

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

describe('editValintaperusteForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const valintaperusteId = '1';

  const testValintaperusteFields = {
    organisaatioOid,
  };

  beforeEach(() => {
    stubValintaperusteFormRoutes({ cy, organisaatioOid });

    cy.visit(
      `/organisaatio/${organisaatioOid}/valintaperusteet/${valintaperusteId}/muokkaus`,
    );
  });

  it('should be able to edit valintaperuste', () => {
    cy.route({
      method: 'POST',
      url: '**/valintaperuste',
      response: {
        muokattu: false,
      },
    }).as('updateValintaperusteRequest');

    cy.route({
      method: 'GET',
      url: `**/valintaperuste/${valintaperusteId}`,
      response: merge(
        valintaperuste({ tyyppi: 'amm' }),
        testValintaperusteFields,
      ),
    });

    cy.getByTestId('postinumero').contains('00350');

    fillKieliversiotSection();
    tallenna();

    cy.wait('@updateValintaperusteRequest').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });
  });
});
