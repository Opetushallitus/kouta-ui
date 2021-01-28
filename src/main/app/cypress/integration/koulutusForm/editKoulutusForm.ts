import _fp from 'lodash/fp';
import { playMocks } from 'kto-ui-common/cypress/mockUtils';
import koulutusMocks from '#/cypress/mocks/koulutus.mocks.json';
import {
  fillKieliversiotSection,
  tallenna,
  assertNoUnsavedChangesDialog,
} from '#/cypress/utils';
import koulutus from '#/cypress/data/koulutus';
import { stubKoulutusFormRoutes } from '#/cypress/koulutusFormUtils';

const organisaatioOid = '1.1.1.1.1.1';
const koulutusOid = '1.2.3.4.5.6';

const prepareTest = tyyppi => {
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
};

export const editKoulutusForm = () => {
  beforeEach(() => {
    playMocks(koulutusMocks);
  });

  it('should be able to edit ammatillinen koulutus', () => {
    prepareTest('amm');
    cy.visit(
      `/organisaatio/${organisaatioOid}/koulutus/${koulutusOid}/muokkaus`
    );

    cy.intercept(
      { method: 'POST', url: '**/koulutus' },
      {
        body: {
          oid: '1.2.3.4.5.6',
        },
      }
    ).as('updateAmmKoulutusResponse');

    fillKieliversiotSection();

    // Need to wait for changes to settle. Otherwise nimi-field will not be set fast enough.
    // TODO: Should block save button before all fields have 'settled'. Logic for setting nimi-field could also be simplified.
    // eslint-disable-next-line
    cy.wait(1000);

    tallenna();

    cy.wait('@updateAmmKoulutusResponse').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

  it('should be able to edit AMK-koulutus', () => {
    prepareTest('amk');
    cy.visit(
      `/organisaatio/${organisaatioOid}/koulutus/${koulutusOid}/muokkaus`
    );
    cy.intercept(
      { method: 'POST', url: '**/koulutus' },
      {
        body: {
          muokattu: false,
        },
      }
    ).as('updateAmkKoulutusResponse');

    fillKieliversiotSection();

    // Need to wait for changes to settle. Otherwise nimi-field will not be set fast enough.
    // TODO: Should block save button before all fields have 'settled'. Logic for setting nimi-field could also be simplified.
    // eslint-disable-next-line
    cy.wait(1000);
    tallenna();

    cy.wait('@updateAmkKoulutusResponse').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

  it('should be able to edit lukiokoulutus', () => {
    prepareTest('lk');
    cy.visit(
      `/organisaatio/${organisaatioOid}/koulutus/${koulutusOid}/muokkaus`
    );
    cy.intercept(
      { method: 'POST', url: '**/koulutus' },
      {
        body: {
          muokattu: false,
        },
      }
    ).as('updateLkKoulutusResponse');

    fillKieliversiotSection();

    // Need to wait for changes to settle. Otherwise nimi-field will not be set fast enough.
    // TODO: Should block save button before all fields have 'settled'. Logic for setting nimi-field could also be simplified.
    // eslint-disable-next-line
    cy.wait(1000);

    tallenna();

    cy.wait('@updateLkKoulutusResponse').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

  it("Shouldn't complain about unsaved changed for untouched form", () => {
    prepareTest('amm');
    cy.visit(
      `/organisaatio/${organisaatioOid}/koulutus/${koulutusOid}/muokkaus`
    );
    assertNoUnsavedChangesDialog();
  });

  // Skipping this for now, because it sometimes redirects to "undefined" organization
  // TODO: Fix koulutus redirect sometimes going to undefined organization
  it.skip('Should redirect from url without organization', () => {
    prepareTest('amm');
    cy.visit(`/koulutus/${koulutusOid}/muokkaus`);
    cy.url().should(
      'include',
      `/organisaatio/${organisaatioOid}/koulutus/${koulutusOid}/muokkaus`
    );
  });
};
