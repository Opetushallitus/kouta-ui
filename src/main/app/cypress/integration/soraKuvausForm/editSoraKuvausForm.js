import merge from 'lodash/merge';

import { chooseKieliversiotLanguages } from '../../utils';
import { stubSoraKuvausFormRoutes } from '../../soraKuvausFormUtils';

import createSoraKuvaus from '../../data/soraKuvaus';

const fillKieliversiotSection = cy => {
  cy.getByTestId('kieliversiotSection').within(() => {
    chooseKieliversiotLanguages(['fi'], cy);
  });
};

const tallenna = cy => {
  cy.getByTestId('tallennaSoraKuvausButton').click();
};

describe('editSoraKuvausForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const soraKuvaus = createSoraKuvaus();

  beforeEach(() => {
    cy.server();

    stubSoraKuvausFormRoutes({ organisaatioOid, cy });

    cy.visit(`/sora-kuvaus/${soraKuvaus.id}/muokkaus`);
  });

  it('should be able to edit sora-kuvaus', () => {
    cy.route({
      method: 'GET',
      url: `**/sora-kuvaus/${soraKuvaus.id}`,
      response: merge({}, soraKuvaus, {
        organisaatioOid,
      }),
    });

    cy.route({
      method: 'POST',
      url: '**/sora-kuvaus',
      response: {
        muokattu: false,
      },
    }).as('editSoraKuvausRequest');

    fillKieliversiotSection(cy);

    tallenna(cy);

    cy.wait('@editSoraKuvausRequest').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });
  });
});
