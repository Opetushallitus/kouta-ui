import koulutus from '#/cypress/data/koulutus';
import toteutus from '#/cypress/data/toteutus';
import { stubToteutusFormRoutes } from '#/cypress/toteutusFormUtils';
import {
  assertNoUnsavedChangesDialog,
  fillKieliversiotSection,
  tallenna,
} from '#/cypress/utils';
import { merge } from 'lodash';

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

export const editToteutusForm = () => {
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

    cy.findByTestId('hakukohteetSection').should('exist');

    tallenna();

    cy.wait('@updateAmmToteutusResponse').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

  it('should be able to edit tutkinnon osa toteutus', () => {
    prepareTest('amm-tutkinnon-osa');
    cy.route({
      method: 'POST',
      url: '**/toteutus',
      response: {
        muokattu: false,
      },
    }).as('updateAmmToteutusResponse');

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

    cy.findByTestId('hakukohteetSection').should('exist');

    tallenna();

    cy.wait('@updateLkToteutusResponse').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

  it("Shouldn't complain about unsaved changed for untouched form", () => {
    prepareTest('amm');
    assertNoUnsavedChangesDialog();
  });
};
