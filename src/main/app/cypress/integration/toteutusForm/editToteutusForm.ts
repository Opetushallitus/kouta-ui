import { playMocks } from 'kto-ui-common/cypress/mockUtils';
import _fp from 'lodash/fp';

import koulutus from '#/cypress/data/koulutus';
import toteutus from '#/cypress/data/toteutus';
import toteutusMocks from '#/cypress/mocks/toteutus.mocks.json';
import { stubToteutusFormRoutes } from '#/cypress/toteutusFormUtils';
import {
  assertNoUnsavedChangesDialog,
  fillKieliversiotSection,
  tallenna,
} from '#/cypress/utils';

const organisaatioOid = '1.1.1.1.1.1';
const koulutusOid = '1.2.1.1.1.1';
const toteutusOid = '1.3.1.1.1.1';
const perusteId = '1';

const prepareTest = tyyppi => {
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

  playMocks(toteutusMocks);

  stubToteutusFormRoutes({ organisaatioOid, perusteId });

  cy.intercept(
    { method: 'GET', url: `**/toteutus/${toteutusOid}/hakukohteet/list**` },
    { body: [] }
  );

  cy.intercept(
    { method: 'GET', url: `**/koulutus/${koulutusOid}` },
    { body: _fp.merge(koulutus({ tyyppi }), testKoulutusFields) }
  );

  cy.intercept(
    { method: 'GET', url: `**/toteutus/${toteutusOid}` },
    { body: _fp.merge(toteutus({ tyyppi }), testToteutusFields) }
  );

  cy.visit(`/organisaatio/${organisaatioOid}/toteutus/${toteutusOid}/muokkaus`);
};

export const editToteutusForm = () => {
  it('should be able to edit ammatillinen toteutus', () => {
    prepareTest('amm');
    cy.intercept(
      { method: 'POST', url: '**/toteutus' },
      {
        body: {
          muokattu: false,
        },
      }
    ).as('updateAmmToteutusResponse');

    fillKieliversiotSection();

    cy.findByTestId('hakukohteetSection').should('exist');

    tallenna();

    cy.wait('@updateAmmToteutusResponse').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

  it('should be able to edit tutkinnon osa toteutus', () => {
    prepareTest('amm-tutkinnon-osa');
    cy.intercept(
      { method: 'POST', url: '**/toteutus' },
      {
        body: {
          muokattu: false,
        },
      }
    ).as('updateAmmToteutusResponse');

    fillKieliversiotSection();
    cy.findByTestId('hakeutumisTaiIlmoittautumistapaSection').within(() => {
      cy.findByRole('button', {
        name: 'toteutuslomake.hakuTapa.hakeutuminen',
      }).click();

      cy.findByText('toteutuslomake.hakemuspalvelu').click();
    });

    cy.findByTestId('hakukohteetSection').should('exist');

    cy.findByTestId('hakeutumisTaiIlmoittautumistapaSection').within(() => {
      cy.findByText('toteutuslomake.muuHakulomake').click();
    });

    cy.findByTestId('hakukohteetSection').should('not.exist');

    cy.findByTestId('hakeutumisTaiIlmoittautumistapaSection').within(() => {
      cy.findByText('toteutuslomake.eiSahkoistaHakua').click();
    });

    cy.findByTestId('hakukohteetSection').should('not.exist');

    tallenna();

    cy.wait('@updateAmmToteutusResponse').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

  it('should be able to edit korkeakoulu toteutus', () => {
    prepareTest('yo');

    cy.intercept(
      { method: 'POST', url: '**/toteutus' },
      {
        body: {
          muokattu: false,
        },
      }
    ).as('updateYoToteutusResponse');

    fillKieliversiotSection();
    tallenna();

    cy.wait('@updateYoToteutusResponse').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

  it('should be able to edit lukio toteutus', () => {
    prepareTest('lk');

    cy.intercept(
      { method: 'POST', url: '**/toteutus' },
      {
        body: {
          muokattu: false,
        },
      }
    ).as('updateLkToteutusResponse');

    fillKieliversiotSection();

    cy.findByTestId('hakukohteetSection').should('exist');

    tallenna();

    cy.wait('@updateLkToteutusResponse').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

  it("Shouldn't complain about unsaved changes for untouched form", () => {
    prepareTest('amm');
    assertNoUnsavedChangesDialog();
  });

  it('Should redirect from url without organization', () => {
    prepareTest('amm');
    cy.visit(`/toteutus/${toteutusOid}/muokkaus`);
    cy.url().should(
      'include',
      `/organisaatio/${organisaatioOid}/toteutus/${toteutusOid}/muokkaus`
    );
  });
};
