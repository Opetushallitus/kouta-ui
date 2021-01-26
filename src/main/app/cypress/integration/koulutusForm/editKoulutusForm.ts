import _fp from 'lodash/fp';
import {
  fillKieliversiotSection,
  tallenna,
  assertNoUnsavedChangesDialog,
} from '#/cypress/utils';
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

  stubKoulutusFormRoutes({ organisaatioOid });

  cy.intercept(
    { method: 'GET', url: `**/koulutus/${koulutusOid}/toteutukset` },
    { body: [] }
  );

  cy.intercept({ method: 'GET', url: `**/toteutus/list**` }, { body: [] });

  cy.intercept(
    { method: 'GET', url: `**/koulutus/${koulutusOid}` },
    { body: _fp.merge(koulutus({ tyyppi }), testKoulutusFields) }
  );

  cy.visit(`/organisaatio/${organisaatioOid}/koulutus/${koulutusOid}/muokkaus`);
};

export const editKoulutusForm = () => {
  it('should be able to edit ammatillinen koulutus', () => {
    prepareTest('amm');
    cy.intercept(
      { method: 'POST', url: '**/koulutus' },
      {
        body: {
          oid: '1.2.3.4.5.6',
        },
      }
    ).as('updateAmmKoulutusResponse');

    fillKieliversiotSection();
    tallenna();

    cy.wait('@updateAmmKoulutusResponse').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

  it('should be able to edit AMK-koulutus', () => {
    prepareTest('amk');
    cy.intercept(
      { method: 'POST', url: '**/koulutus' },
      {
        body: {
          muokattu: false,
        },
      }
    ).as('updateAmkKoulutusResponse');

    fillKieliversiotSection();
    tallenna();

    cy.wait('@updateAmkKoulutusResponse').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

  it('should be able to edit lukiokoulutus', () => {
    prepareTest('lk');
    cy.intercept(
      { method: 'POST', url: '**/koulutus' },
      {
        body: {
          muokattu: false,
        },
      }
    ).as('updateLkKoulutusResponse');

    fillKieliversiotSection();
    tallenna();

    cy.wait('@updateLkKoulutusResponse').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

  it("Shouldn't complain about unsaved changed for untouched form", () => {
    prepareTest('amm');
    assertNoUnsavedChangesDialog();
  });
};
