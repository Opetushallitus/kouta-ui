import { merge } from 'lodash';

import {
  stubKoodistoRoute,
  stubOppijanumerorekisteriHenkiloRoute,
  stubEPerusteetByKoulutuskoodiRoute,
} from '#/cypress/utils';
import organisaatioHierarkia from '#/cypress/data/organisaatioHierarkia';
import organisaatio from '#/cypress/data/organisaatio';
import koodisto from '#/cypress/data/koodisto';

export const stubKoulutusFormRoutes = ({ cy, organisaatioOid }) => {
  cy.server();

  cy.route({
    method: 'GET',
    url: `**/organisaatio-service/rest/organisaatio/v4/hierarkia/hae?oid=${organisaatioOid}**`,
    response: organisaatioHierarkia({ rootOid: organisaatioOid }),
  });

  cy.route({
    method: 'GET',
    url: `**/organisaatio-service/rest/organisaatio/v4/${organisaatioOid}**`,
    response: merge(organisaatio(), {
      oid: organisaatioOid,
    }),
  });

  cy.route({
    method: 'POST',
    url: '**/organisaatio-service/rest/organisaatio/v4/findbyoids',
    response: [
      merge(organisaatio(), {
        oid: organisaatioOid,
      }),
    ],
  });

  cy.route({
    method: 'GET',
    url:
      '**/koodisto-service/rest/json/relaatio/sisaltyy-ylakoodit/koulutustyyppi_*',
    response: koodisto({ koodisto: 'koulutus' }),
  });

  cy.route({
    method: 'GET',
    url: `**/koulutus/list?organisaatioOid=${organisaatioOid}`,
    response: [],
  });

  cy.route({
    method: 'GET',
    url: `**/koulutus/*/toteutukset/list**`,
    response: [],
  });

  cy.route({
    method: 'GET',
    url: 'koodisto-service/rest/codeelement/koulutus_0/1',
    response: {
      koodiArvo: '0',
      koodiUri: 'koulutus_0',
      versio: 1,
      metadata: [{ kieli: 'fi', nimi: 'koulutus_0' }],
    },
  });

  cy.route({
    method: 'GET',
    url: '**/eperusteet-service/api/perusteet/1/suoritustavat/reformi/rakenne',
    response: {
      muodostumisSaanto: {
        laajuus: {
          minimi: 180,
        },
      },
    },
  });

  cy.route({
    method: 'GET',
    url: '**/eperusteet-service/api/perusteet/1',
    response: {
      id: 1,
      nimi: {
        fi: 'koulutus_0',
      },
      kuvaus: {
        fi: 'koulutus_0 kuvaus',
      },
      koulutukset: [
        {
          nimi: 'koulutus_0',
          koulutuskoodiArvo: '1',
        },
      ],
    },
  });

  stubEPerusteetByKoulutuskoodiRoute();

  cy.route({
    method: 'GET',
    url:
      '**/koodisto-service/rest/json/relaatio/sisaltyy-alakoodit/koulutus_0**',
    response: [
      {
        koodiUri: 'okmohjauksenala_1',
        metadata: [{ kieli: 'fi', nimi: 'Ala' }],
      },
      {
        koodiUri: 'opintojenlaajuus_1',
        metadata: [{ kieli: 'fi', nimi: '180' }],
      },
      {
        koodiUri: 'opintojenlaajuusyksikko_1',
        metadata: [{ kieli: 'fi', nimi: 'op' }],
      },
    ],
  });

  stubKoodistoRoute({ koodisto: 'tutkintonimikekk', cy });
  stubKoodistoRoute({ koodisto: 'opintojenlaajuus', cy });
  stubKoodistoRoute({ koodisto: 'koulutuksenlisatiedot', cy });
  stubKoodistoRoute({ koodisto: 'koulutus', cy });

  stubKoodistoRoute({
    koodisto: 'kansallinenkoulutusluokitus2016koulutusalataso2',
    cy,
  });

  stubOppijanumerorekisteriHenkiloRoute({ cy });
};
