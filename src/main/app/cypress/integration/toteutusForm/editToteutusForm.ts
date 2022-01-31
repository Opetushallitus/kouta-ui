import { playMocks } from 'kto-ui-common/cypress/mockUtils';
import { merge } from 'lodash/fp';

import koulutus from '#/cypress/data/koulutus';
import toteutus from '#/cypress/data/toteutus';
import lukioMocks from '#/cypress/mocks/lukio.mocks.json';
import toteutusMocks from '#/cypress/mocks/toteutus.mocks.json';
import { stubToteutusFormRoutes } from '#/cypress/toteutusFormUtils';
import {
  assertNoUnsavedChangesDialog,
  confirmDelete,
  fillKieliversiotSection,
  fillTilaSection,
  tallenna,
  wrapMutationTest,
} from '#/cypress/utils';
import { ENTITY, OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';

const organisaatioOid = '1.1.1.1.1.1';
const koulutusOid = '1.2.1.1.1.1';
const toteutusOid = '1.3.1.1.1.1';

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
  };

  playMocks(toteutusMocks);

  if (tyyppi === 'lk') {
    playMocks(lukioMocks);
  }

  stubToteutusFormRoutes({ organisaatioOid });

  cy.intercept(
    { method: 'GET', url: `**/toteutus/${toteutusOid}/hakukohteet/list**` },
    { body: [] }
  );

  cy.intercept(
    { method: 'GET', url: `**/koulutus/${koulutusOid}` },
    { body: merge(koulutus({ tyyppi }), testKoulutusFields) }
  );

  cy.intercept(
    { method: 'GET', url: `**/toteutus/${toteutusOid}` },
    { body: merge(toteutus({ tyyppi }), testToteutusFields) }
  );

  cy.visit(`/organisaatio/${organisaatioOid}/toteutus/${toteutusOid}/muokkaus`);
};

export const editToteutusForm = () => {
  const mutationTest = wrapMutationTest({
    oid: toteutusOid,
    entity: ENTITY.TOTEUTUS,
  });

  it(
    'should be able to edit ammatillinen toteutus',
    mutationTest(() => {
      prepareTest('amm');

      fillKieliversiotSection();

      cy.findByTestId('hakukohteetSection').should('exist');

      tallenna();
    })
  );

  it(
    'should be able to edit tutkinnon osa toteutus',
    mutationTest(() => {
      prepareTest('amm-tutkinnon-osa');

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
    })
  );

  it(
    'should be able to edit korkeakoulu toteutus',
    mutationTest(() => {
      prepareTest('yo');

      fillKieliversiotSection();
      tallenna();
    })
  );

  it(
    'should be able to edit lukio toteutus',
    mutationTest(() => {
      prepareTest('lk');

      fillKieliversiotSection();

      cy.findByTestId('hakukohteetSection').should('exist');

      tallenna();
    })
  );

  it(
    'should be able to edit tuva toteutus',
    mutationTest(() => {
      prepareTest('tuva');

      fillKieliversiotSection();

      cy.findByLabelText(/toteutuslomake.laajuus/)
        .should('be.disabled')
        .should('have.value', '38 viikkoa');

      cy.findByTestId('hakukohteetSection').should('exist');

      tallenna();
    })
  );

  it(
    'should be able to edit telma toteutus',
    mutationTest(() => {
      prepareTest('telma');

      fillKieliversiotSection();

      cy.findByLabelText(/toteutuslomake.laajuus/)
        .should('be.disabled')
        .should('have.value', '60 osaamispistettä');

      cy.findByTestId('hakukohteetSection').should('exist');

      tallenna();
    })
  );

  it(
    'should be able to edit muu ammatillinen toteutus',
    mutationTest(() => {
      prepareTest('amm-muu');

      fillKieliversiotSection();

      cy.findByLabelText(/toteutuslomake.laajuus/)
        .should('be.disabled')
        .should('have.value', 'vähintään 53 op');

      cy.findByTestId('hakeutumisTaiIlmoittautumistapaSection').within(() => {
        cy.findByRole('button', {
          name: 'toteutuslomake.hakuTapa.hakeutuminen',
        }).click();

        cy.findByText('toteutuslomake.hakemuspalvelu').click();
      });

      cy.findByTestId('hakukohteetSection').should('exist');

      tallenna();
    })
  );

  it(
    'should be able to edit "Aikuisten perusopetus" -toteutus',
    mutationTest(() => {
      prepareTest('aikuisten-perusopetus');

      fillKieliversiotSection();

      cy.findByLabelText(/toteutuslomake.laajuus/)
        .should('be.disabled')
        .should('have.value', '38 viikkoa');

      cy.findByTestId('hakeutumisTaiIlmoittautumistapaSection').within(() => {
        cy.findByRole('button', {
          name: 'toteutuslomake.hakuTapa.hakeutuminen',
        }).click();

        cy.findByText('toteutuslomake.hakemuspalvelu').click();
      });

      cy.findByTestId('hakukohteetSection').should('exist');

      tallenna();
    })
  );

  it(
    'should be able to delete toteutus',
    mutationTest(() => {
      prepareTest('amm');

      fillKieliversiotSection();
      fillTilaSection('poistettu');

      tallenna();
      confirmDelete();
    })
  );

  it("Shouldn't complain about unsaved changes for untouched form", () => {
    prepareTest('amm');
    assertNoUnsavedChangesDialog();
  });

  it('Should redirect from url without organization', () => {
    prepareTest('amm');
    cy.visit(`/toteutus/${toteutusOid}/muokkaus`);
    cy.url().should(
      'include',
      `/organisaatio/${OPETUSHALLITUS_ORGANISAATIO_OID}/toteutus/${toteutusOid}/muokkaus`
    );
  });
};
