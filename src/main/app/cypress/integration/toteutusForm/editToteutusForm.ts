import { merge } from 'lodash';

import { getByTestId, fillKieliversiotSection } from '#/cypress/utils';
import koulutus from '#/cypress/data/koulutus';
import toteutus from '#/cypress/data/toteutus';
import { stubToteutusFormRoutes } from '#/cypress/toteutusFormUtils';

const tallenna = () => {
  getByTestId('tallennaToteutusButton').click();
};

const prepareTest = tyyppi => {
  const organisaatioOid = '1.1.1.1.1.1';
  const koulutusOid = '1.2.1.1.1.1';
  const toteutusOid = '1.3.1.1.1.1';
  const perusteId = '1';

  const testKoulutusFields = {
    oid: koulutusOid,
    organisaatioOid: organisaatioOid,
    koulutusKoodiUri: 'koulutus_0#1',
    tarjoajat: ['4.1.1.1.1.1', '2.1.1.1.1.1'],
  };

  const testToteutusFields = {
    oid: toteutusOid,
    tarjoajat: ['5.1.1.1.1.1', '3.1.1.1.1.1'],
    organisaatioOid: organisaatioOid,
    koulutusOid: koulutusOid,
    metadata: {
      opetus: {
        koulutuksenTarkkaAlkamisaika: false,
        koulutuksenAlkamiskausi: 'kausi_0#1',
        koulutuksenAlkamisvuosi: 2020,
      },
    },
  };

  cy.server();

  stubToteutusFormRoutes({ organisaatioOid, perusteId });

  cy.route({
    method: 'GET',
    url: `**/toteutus/${toteutusOid}/hakukohteet/list**`,
    response: [],
  });

  cy.route({
    method: 'GET',
    url: `**/koulutus/${koulutusOid}`,
    response: merge(koulutus({ tyyppi }), testKoulutusFields),
  });

  cy.route({
    method: 'GET',
    url: `**/toteutus/${toteutusOid}`,
    response: merge(toteutus({ tyyppi }), testToteutusFields),
  });

  cy.visit(`/organisaatio/${organisaatioOid}/toteutus/${toteutusOid}/muokkaus`);
};

describe('editToteutusForm', () => {
  it('should be able to edit ammatillinen toteutus', () => {
    prepareTest('amm');
    cy.route({
      method: 'POST',
      url: '**/toteutus',
      response: {
        muokattu: false,
      },
    }).as('updateAmmToteutusResponse');

    fillKieliversiotSection();
    tallenna();

    cy.wait('@updateAmmToteutusResponse').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

  it('should be able to edit korkeakoulu toteutus', () => {
    prepareTest('yo');

    cy.route({
      method: 'POST',
      url: '**/toteutus',
      response: {
        muokattu: false,
      },
    }).as('updateYoToteutusResponse');

    fillKieliversiotSection();
    tallenna();

    cy.wait('@updateYoToteutusResponse').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

  it('should be able to edit lukio toteutus', () => {
    prepareTest('lk');

    cy.route({
      method: 'POST',
      url: '**/toteutus',
      response: {
        muokattu: false,
      },
    }).as('updateLkToteutusResponse');

    fillKieliversiotSection();
    tallenna();

    cy.wait('@updateLkToteutusResponse').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });
});
