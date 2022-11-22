import { merge } from 'lodash/fp';

import organisaatio from '#/cypress/data/organisaatio';
import organisaatioHierarkia from '#/cypress/data/organisaatioHierarkia';
import { stubCommonRoutes, getByTestId } from '#/cypress/utils';

const stubMyOrganisations = () => {
  const oid = '1.2.246.562.10.00000000001';

  cy.intercept(
    {
      method: 'GET',
      url: `/organisaatio-service/rest/organisaatio/v4/${oid}`,
    },
    {
      body: merge(organisaatio(), {
        oid,
      }),
    }
  );

  cy.intercept(
    {
      method: 'GET',
      url: `/organisaatio-service/rest/organisaatio/v4/hierarkia/hae**oid=${oid}`,
    },
    { body: organisaatioHierarkia() }
  );

  cy.intercept(
    {
      method: 'POST',
      url: '/kouta-backend/organisaatio/organisaatiot',
    },
    {
      body: [
        merge(organisaatio(), {
          oid,
          nimi: {
            fi: 'Organisaatio_1',
          },
        }),
      ],
    }
  );

  cy.intercept(
    {
      method: 'GET',
      url: '/kayttooikeus-service/organisaatiohenkilo/organisaatioOid',
    },
    { body: [oid] }
  );

  cy.intercept(
    { method: 'GET', url: '/kouta-backend/koulutus/list*' },
    { body: [] }
  );

  cy.intercept(
    { method: 'GET', url: '/kouta-backend/haku/list*' },
    { body: [] }
  );

  cy.intercept(
    { method: 'GET', url: '/kouta-backend/toteutus/list*' },
    { body: [] }
  );

  cy.intercept(
    { method: 'GET', url: '/kouta-backend/hakukohde/list*' },
    { body: [] }
  );
};

describe('frontPage', () => {
  before(() => {
    stubCommonRoutes();

    stubMyOrganisations();

    cy.visit('/');
  });

  it('should display organisation hierarchy', () => {
    getByTestId('selectedOrganisaatio').should('contain', 'Organisaatio_1');

    getByTestId('toggleOrganisaatioDrawer').click();

    getByTestId('organisaatioDrawer').should(
      'contain',
      'etusivu.vaihdaOrganisaatiota'
    );
  });

  it('should display navigation links', () => {
    cy.findAllByTestId('navigaatio')
      .should('contain', 'yleiset.koulutukset')
      .should('contain', 'yleiset.toteutukset')
      .should('contain', 'yleiset.haut')
      .should('contain', 'yleiset.hakukohteet');
  });

  it('should list koulutukset', () => {
    cy.get('#koulutukset').scrollIntoView();

    getByTestId('koulutusTable').should('contain', 'Koulutuksen nimi');
  });

  it('should list toteutukset', () => {
    cy.get('#toteutukset').scrollIntoView();

    getByTestId('toteutusTable').should('contain', 'Toteutuksen nimi');
  });

  it('should list haut', () => {
    cy.get('#haut').scrollIntoView();

    getByTestId('hakuTable').should('contain', 'Haun nimi');
  });

  it('should list valintaperusteet', () => {
    cy.get('#valintaperusteet').scrollIntoView();

    getByTestId('valintaperusteTable').should(
      'contain',
      'Valintaperusteen nimi'
    );
  });

  it('should list hakukohteet', () => {
    cy.get('#hakukohteet').scrollIntoView();

    getByTestId('hakukohdeTable').should('contain', 'Hakukohteen nimi');
  });
});
