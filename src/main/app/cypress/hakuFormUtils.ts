import { merge } from 'lodash';

import { playMockFile } from 'kto-ui-common/cypress/mockUtils';
import createKoodisto from '#/cypress/data/koodisto';

import organisaatio from '#/cypress/data/organisaatio';
import createKoodi from '#/cypress/data/koodi';
import organisaatioHierarkia from '#/cypress/data/organisaatioHierarkia';

import {
  stubKoodistoRoute,
  stubHakemuspalveluLomakkeetRoute,
  stubOppijanumerorekisteriHenkiloRoute,
  stubKoodiRoute,
  stubCommonRoutes,
} from './utils';

export const stubHakuFormRoutes = ({ organisaatioOid }) => {
  stubCommonRoutes();
  playMockFile('haku.mocks.json');

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

  stubKoodistoRoute({ koodisto: 'haunkohdejoukontarkenne' });
  stubKoodistoRoute({ koodisto: 'opetuspaikkakk' });
  stubKoodistoRoute({ koodisto: 'posti' });
  stubKoodiRoute(createKoodi({ koodisto: 'posti', versio: 2 }));

  cy.intercept(
    {
      method: 'GET',
      url: `**/koodisto-service/rest/json/haunkohdejoukko/koodi**`,
    },
    {
      body: createKoodisto({ koodisto: 'haunkohdejoukko' }).map((v, index) =>
        index === 0
          ? {
              ...v,
              koodiUri: 'haunkohdejoukko_12',
            }
          : v
      ),
    }
  );

  cy.intercept(
    { method: 'GET', url: `**/koodisto-service/rest/json/hakutapa/koodi**` },
    {
      body: createKoodisto({ koodisto: 'hakutapa' }).map((v, index) =>
        index === 0
          ? {
              ...v,
              koodiUri: 'hakutapa_01',
            }
          : v
      ),
    }
  );

  cy.intercept({ method: 'GET', url: '**/haku/list**' }, { body: [] });

  cy.intercept({ method: 'GET', url: `**/toteutus/list**` }, { body: [] });

  stubHakemuspalveluLomakkeetRoute();
  stubOppijanumerorekisteriHenkiloRoute();
};
