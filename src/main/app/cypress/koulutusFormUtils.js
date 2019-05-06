import merge from 'lodash/merge';

import { stubKoodistoRoute } from './utils';
import organisaatioHierarkia from './data/organisaatioHierarkia';
import organisaatio from './data/organisaatio';
import koodisto from './data/koodisto';

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
    url: '**/koodisto-service/rest/codeelement/koulutus_0',
    response: [
      {
        koodiUri: 'koulutus_0',
        versio: 1,
        metadata: [{ kieli: 'fi', nimi: 'Nimi' }],
      },
    ],
  });

  cy.route({
    method: 'GET',
    url:
      '**/eperusteet-service/api/perusteet?tuleva=true&siirtyma=false&voimassaolo=true&poistunut=false&kieli=fi&koulutuskoodi=koulutus_0',
    response: {
      data: [
        {
          kuvaus: { fi: 'koulutus_0 kuvaus' },
          osaamisalat: [],
          tutkintonimikeKoodiUri: 'nimike_1#1',
          id: '1',
        },
      ],
    },
  });

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
  stubKoodistoRoute({ koodisto: 'koulutuksenjarjestamisenlisaosiot', cy });
};
