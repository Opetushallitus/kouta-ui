import { merge } from 'lodash';

import {
  stubKoodistoRoute,
  stubOppijanumerorekisteriHenkiloRoute,
  stubEPerusteetByKoulutuskoodiRoute,
  stubCommonRoutes,
} from '#/cypress/utils';
import organisaatio from '#/cypress/data/organisaatio';
import organisaatioHierarkia from '#/cypress/data/organisaatioHierarkia';
import koodisto from '#/cypress/data/koodisto';
import ePeruste6777660 from './data/ePeruste6777660';

export const stubToteutusFormRoutes = ({ organisaatioOid, perusteId }) => {
  stubCommonRoutes();

  cy.intercept({ method: 'GET', url: `**/haku/list**` }, { body: [] });

  cy.intercept(
    {
      method: 'GET',
      url: `**/organisaatio-service/rest/organisaatio/v4/hierarkia/hae?oid=${organisaatioOid}**`,
    },
    { body: organisaatioHierarkia({ rootOid: organisaatioOid }) }
  );

  cy.intercept(
    {
      method: 'GET',
      url: `**/organisaatio-service/rest/organisaatio/v4/${organisaatioOid}**`,
    },
    {
      body: merge(organisaatio(), {
        oid: organisaatioOid,
      }),
    }
  );

  cy.intercept(
    {
      method: 'POST',
      url: '**/organisaatio-service/rest/organisaatio/v4/findbyoids',
    },
    {
      body: [
        merge(organisaatio(), {
          oid: organisaatioOid,
        }),
      ],
    }
  );

  stubKoodistoRoute({ koodisto: 'koulutuksenlisatiedot' });
  stubKoodistoRoute({ koodisto: 'oppilaitoksenopetuskieli' });
  stubKoodistoRoute({ koodisto: 'opetusaikakk' });
  stubKoodistoRoute({ koodisto: 'opetuspaikkakk' });
  stubKoodistoRoute({ koodisto: 'kieli' });
  stubKoodistoRoute({ koodisto: 'lukiodiplomit' });
  stubKoodistoRoute({ koodisto: 'lukiolinjat' });

  cy.intercept(
    {
      method: 'GET',
      url:
        '**/koodisto-service/rest/json/relaatio/sisaltyy-ylakoodit/koulutustyyppi_*',
    },
    { body: koodisto({ koodisto: 'koulutus' }) }
  );

  cy.intercept({ method: 'GET', url: '**/toteutus/list**' }, { body: [] });

  cy.intercept(
    { method: 'GET', url: '**/koodisto-service/rest/codeelement/koulutus_0' },
    {
      body: [
        {
          koodiUri: 'koulutus_0',
          versio: 1,
          metadata: [{ kieli: 'fi', nimi: 'Nimi' }],
        },
      ],
    }
  );

  stubEPerusteetByKoulutuskoodiRoute();

  cy.intercept(
    { method: 'GET', url: `**/eperusteet-service/api/perusteet/${perusteId}` },
    {
      body: {
        kuvaus: { fi: 'koulutus_0 kuvaus' },
        osaamisalat: [
          { uri: 'osaamisala_0', nimi: { fi: 'osaamisala_0 nimi' } },
        ],
        tutkintonimikeKoodiUri: 'nimike_1#1',
        id: perusteId,
      },
    }
  );

  cy.intercept(
    {
      method: 'GET',
      url: `**/eperusteet-service/api/perusteet/${perusteId}/osaamisalakuvaukset`,
    },
    {
      body: {
        data: {
          reformi: {},
        },
      },
    }
  );

  cy.intercept(
    {
      method: 'GET',
      url:
        '**/koodisto-service/rest/json/relaatio/sisaltyy-alakoodit/koulutus_0**',
    },
    {
      body: [
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
    }
  );

  cy.intercept(
    { method: 'GET', url: '**/ammattinimike/search/**' },
    { body: [] }
  );

  cy.intercept({ method: 'GET', url: '**/asiasana/search/**' }, { body: [] });

  cy.intercept({ method: 'GET', url: '**/sorakuvaus/list**' }, { body: [] });

  cy.intercept(
    { method: 'GET', url: '**/eperusteet-service/api/perusteet/6777660' },
    { body: ePeruste6777660 }
  );

  stubOppijanumerorekisteriHenkiloRoute();
};
