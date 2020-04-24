import { merge } from 'lodash';

import { chooseKieliversiotLanguages } from '../../utils';
import { stubSoraKuvausFormRoutes } from '../../soraKuvausFormUtils';

import createSoraKuvaus from '../../data/soraKuvaus';

const fillKieliversiotSection = () => {
  cy.getByTestId('kieliversiotSection').within(() => {
    chooseKieliversiotLanguages(['fi'], cy);
  });
};

const tallenna = () => {
  cy.getByTestId('tallennaSoraKuvausButton').click();
};

describe('editSoraKuvausForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const soraKuvaus = createSoraKuvaus();

  beforeEach(() => {
    cy.server();

    stubSoraKuvausFormRoutes({ organisaatioOid, cy });

    cy.route({
      method: 'GET',
      url: `**/sorakuvaus/${soraKuvaus.id}`,
      response: merge({}, soraKuvaus, {
        organisaatioOid,
      }),
    });

    cy.visit(
      `/organisaatio/${organisaatioOid}/sora-kuvaus/${soraKuvaus.id}/muokkaus`,
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
