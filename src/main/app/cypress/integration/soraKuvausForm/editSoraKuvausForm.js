import { merge } from 'lodash';

import { chooseKieliversiotLanguages, getByTestId } from '#/cypress/utils';
import { stubSoraKuvausFormRoutes } from '#/cypress/soraKuvausFormUtils';

import createSoraKuvaus from '#/cypress/data/soraKuvaus';

const fillKieliversiotSection = () => {
  getByTestId('kieliversiotSection').within(() => {
    chooseKieliversiotLanguages(['fi']);
  });
};

const tallenna = () => {
  getByTestId('tallennaSoraKuvausButton').click();
};

describe('editSoraKuvausForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const soraKuvaus = createSoraKuvaus();

  beforeEach(() => {
    cy.server();
    stubSoraKuvausFormRoutes({ organisaatioOid });

    cy.route({
      method: 'GET',
      url: `**/sorakuvaus/${soraKuvaus.id}`,
      response: merge({}, soraKuvaus, {
        organisaatioOid,
      }),
    });

    cy.visit(
      `/organisaatio/${organisaatioOid}/sora-kuvaus/${soraKuvaus.id}/muokkaus`
    );
  });

  it('should be able to edit sora-kuvaus', () => {
    cy.route({
      method: 'POST',
      url: '**/sorakuvaus',
      response: {
        muokattu: false,
      },
    }).as('editSoraKuvausRequest');

    fillKieliversiotSection();
    tallenna();

    cy.wait('@editSoraKuvausRequest').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });
  });
});
