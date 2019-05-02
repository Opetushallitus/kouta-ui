import merge from 'lodash/merge';

import { getByTestId, chooseKieliversiotLanguages } from '../../utils';
import valintaperuste from '../../data/valintaperuste';
import { stubValintaperusteFormRoutes } from '../../valintaperusteFormUtils';

const fillKieliversiotSection = cy => {
  getByTestId('kieliversiotSection', cy).within(() => {
    chooseKieliversiotLanguages(['fi'], cy);
  });
};

const tallenna = cy => {
  getByTestId('tallennaValintaperusteButton', cy).click({ force: true });
};

describe('editValintaperusteForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const valintaperusteId = '1';

  const testValintaperusteFields = {
    organisaatioOid,
  };

  beforeEach(() => {
    stubValintaperusteFormRoutes({ cy, organisaatioOid });

    cy.visit(`/valintaperusteet/${valintaperusteId}/muokkaus`);
  });

  it('should be able to edit ammatillinen valintaperuste', () => {
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

    fillKieliversiotSection(cy);
    tallenna(cy);

    cy.wait('@updateValintaperusteRequest').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });
  });

  it('should be able to edit korkeakoulu valintaperuste', () => {
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
        valintaperuste({ tyyppi: 'yo' }),
        testValintaperusteFields,
      ),
    });

    fillKieliversiotSection(cy);
    tallenna(cy);

    cy.wait('@updateValintaperusteRequest').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });
  });
});
