import { merge } from 'lodash';

import {
  stubKoodistoRoute,
  stubOppijanumerorekisteriHenkiloRoute,
  stubEPerusteetByKoulutuskoodiRoute,
} from './utils';
import organisaatio from './data/organisaatio';
import organisaatioHierarkia from './data/organisaatioHierarkia';
import koodisto from './data/koodisto';

export const stubToteutusFormRoutes = ({ cy, organisaatioOid, perusteId }) => {
  cy.server();

  cy.route({
    method: 'GET',
    url: `**/haku/list**`,
    response: [],
  });

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

  stubKoodistoRoute({ koodisto: 'koulutuksenlisatiedot', cy });
  stubKoodistoRoute({ koodisto: 'oppilaitoksenopetuskieli', cy });
  stubKoodistoRoute({ koodisto: 'opetusaikakk', cy });
  stubKoodistoRoute({ koodisto: 'opetuspaikkakk', cy });
  stubKoodistoRoute({ koodisto: 'kausi', cy });
  stubKoodistoRoute({ koodisto: 'kieli', cy });
  stubKoodistoRoute({ koodisto: 'lukiodiplomit', cy });
  stubKoodistoRoute({ koodisto: 'lukiolinjat', cy });

  cy.route({
    method: 'GET',
    url:
      '**/koodisto-service/rest/json/relaatio/sisaltyy-ylakoodit/koulutustyyppi_*',
    response: koodisto({ koodisto: 'koulutus' }),
  });

  cy.route({
    method: 'GET',
    url: '**/toteutus/list**',
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

  stubEPerusteetByKoulutuskoodiRoute();

  cy.route({
    method: 'GET',
    url: `**/eperusteet-service/api/perusteet/${perusteId}`,
    response: {
      kuvaus: { fi: 'koulutus_0 kuvaus' },
      osaamisalat: [{ uri: 'osaamisala_0', nimi: { fi: 'osaamisala_0 nimi' } }],
      tutkintonimikeKoodiUri: 'nimike_1#1',
      id: perusteId,
    },
  });

  cy.route({
    method: 'GET',
    url: `**/eperusteet-service/api/perusteet/${perusteId}/osaamisalakuvaukset`,
    response: {
      data: {
        reformi: {},
      },
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

  cy.route({
    method: 'GET',
    url: '**/ammattinimike/search/**',
    response: [],
  });

  cy.route({
    method: 'GET',
    url: '**/asiasana/search/**',
    response: [],
  });

  stubOppijanumerorekisteriHenkiloRoute({ cy });
};
