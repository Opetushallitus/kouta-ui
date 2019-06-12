import merge from 'lodash/merge';

import organisaatio from '../data/organisaatio';
import organisaatioHierarkia from '../data/organisaatioHierarkia';
import { getByTestId } from '../utils';

const koutaIndexItem = () => ({
  modified: '2019-02-20T07:55',
  muokkaaja: { nimi: 'John Doe', oid: '1.2.246.562.24.62301161440' },
  nimi: { fi: 'Nimi' },
  oid: '1.1.1.1.1.1',
  organisaatio: {},
  tila: 'tallennettu',
});

const stubMyOrganisations = () => {
  const oid = '1.2.246.562.10.00000000001';

  cy.route({
    method: 'GET',
    url: `**/organisaatio-service/rest/organisaatio/v4/${oid}**`,
    response: merge(organisaatio(), {
      oid,
    }),
  });

  cy.route({
    method: 'GET',
    url: `**/organisaatio-service/rest/organisaatio/v4/hierarkia/hae?oid=${oid}**`,
    response: organisaatioHierarkia({ rootOid: oid }),
  });

  cy.route({
    method: 'POST',
    url: '**/organisaatio-service/rest/organisaatio/v4/findbyoids',
    response: [
      merge(organisaatio(), {
        oid,
        nimi: {
          fi: 'Organisaatio_1',
        },
      }),
    ],
  });

  cy.route({
    method: 'GET',
    url: '**/kayttooikeus-service/organisaatiohenkilo/organisaatioOid**',
    response: [oid],
  });
};

describe('frontPage', () => {
  beforeEach(() => {
    cy.server();

    cy.route({
      method: 'GET',
      url: '**/kouta-index/**',
      response: {
        result: [],
        totalCount: 0,
      },
    });

    stubMyOrganisations();

    cy.visit('/');
  });

  it('should display organisation hierarchy', () => {
    getByTestId('selectedOrganisaatio', cy).should('contain', 'Organisaatio_1');

    getByTestId('toggleOrganisaatioDrawer', cy).click();
  });

  it('should list koulutukset', () => {
    cy.route({
      method: 'GET',
      url: '**/kouta-index/koulutus/**',
      response: {
        result: [merge(koutaIndexItem(), { nimi: { fi: 'Koulutuksen nimi' } })],
        totalCount: 1,
      },
    });

    getByTestId('koulutuksetTable', cy).should('contain', 'Koulutuksen nimi');
  });

  it('should list toteutukset', () => {
    cy.route({
      method: 'GET',
      url: '**/kouta-index/toteutus/**',
      response: {
        result: [merge(koutaIndexItem(), { nimi: { fi: 'Toteutuksen nimi' } })],
        totalCount: 1,
      },
    });

    getByTestId('toteutuksetTable', cy).should('contain', 'Toteutuksen nimi');
  });

  it('should list haut', () => {
    cy.route({
      method: 'GET',
      url: '**/kouta-index/haku/**',
      response: {
        result: [merge(koutaIndexItem(), { nimi: { fi: 'Haun nimi' } })],
        totalCount: 1,
      },
    });

    getByTestId('hautTable', cy).should('contain', 'Haun nimi');
  });

  it('should list valintaperusteet', () => {
    cy.route({
      method: 'GET',
      url: '**/kouta-index/valintaperuste/**',
      response: {
        result: [
          merge(koutaIndexItem(), { nimi: { fi: 'Valintaperusteen nimi' } }),
        ],
        totalCount: 1,
      },
    });

    getByTestId('valintaperusteetTable', cy).should(
      'contain',
      'Valintaperusteen nimi',
    );
  });
});
