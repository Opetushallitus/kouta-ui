import _ from 'lodash';

import { fillKieliversiotSection, tallenna } from '#/cypress/utils';
import koulutus from '#/cypress/data/koulutus';
import { stubKoulutusFormRoutes } from '#/cypress/koulutusFormUtils';

const prepareTest = tyyppi => {
  const organisaatioOid = '1.1.1.1.1.1';
  const koulutusOid = '1.2.3.4.5.6';

  const testKoulutusFields = {
    oid: koulutusOid,
    organisaatioOid: organisaatioOid,
    tarjoajat: ['1.1.1.1.1.1', '1.2.1.1.1.1'],
  };

  cy.server();

  stubKoulutusFormRoutes({ organisaatioOid });

  cy.route({
    method: 'GET',
    url: `**/koulutus/${koulutusOid}/toteutukset`,
    response: [],
  });

  cy.route({
    method: 'GET',
    url: `**/toteutus/list**`,
    response: [],
  });

  cy.route({
    method: 'GET',
    url: `**/koulutus/${koulutusOid}`,
    response: _.merge(koulutus({ tyyppi }), testKoulutusFields),
  });

  cy.visit(`/organisaatio/${organisaatioOid}/koulutus/${koulutusOid}/muokkaus`);
};

describe('editKoulutusForm', () => {
  it('should be able to edit ammatillinen koulutus', () => {
    prepareTest('amm');
    cy.route({
      method: 'POST',
      url: '**/koulutus',
      response: {
        oid: '1.2.3.4.5.6',
      },
    }).as('updateAmmKoulutusResponse');

    fillKieliversiotSection();
    tallenna();

    cy.wait('@updateAmmKoulutusResponse').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

  it('should be able to edit korkeakoulu koulutus', () => {
    prepareTest('yo');
    cy.route({
      method: 'POST',
      url: '**/koulutus',
      response: {
        muokattu: false,
      },
    }).as('updateYoKoulutusResponse');

    fillKieliversiotSection();
    tallenna();

    cy.wait('@updateYoKoulutusResponse').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

  it('should be able to edit lukiokoulutus', () => {
    prepareTest('lk');
    cy.route({
      method: 'POST',
      url: '**/koulutus',
      response: {
        muokattu: false,
      },
    }).as('updateLkKoulutusResponse');

    fillKieliversiotSection();
    tallenna();

    cy.wait('@updateLkKoulutusResponse').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });
});
