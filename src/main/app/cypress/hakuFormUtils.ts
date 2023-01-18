import { playMocks } from 'kto-ui-common/cypress/mockUtils';
import { merge } from 'lodash/fp';

import organisaatio from '#/cypress/data/organisaatio';
import hakuMocks from '#/cypress/mocks/haku.mocks.json';

import {
  stubHakemuspalveluLomakkeetRoute,
  stubOppijanumerorekisteriHenkiloRoute,
  stubCommonRoutes,
  koutaSearchItem,
} from './utils';

export const stubHakuFormRoutes = ({ organisaatioOid }) => {
  stubCommonRoutes();
  playMocks(hakuMocks);

  cy.intercept(
    {
      method: 'POST',
      url: '**/kouta-backend/organisaatio/organisaatiot',
    },
    {
      body: [
        merge(organisaatio(), {
          oid: organisaatioOid,
        }),
      ],
    }
  );

  const hakuItem = merge(koutaSearchItem(), {
    nimi: {
      fi: 'Korkeakoulujen yhteishaku',
    },
    tila: 'julkaistu',
  });

  cy.intercept({ method: 'GET', url: '**/haku/list**' }, { body: [hakuItem] });

  cy.intercept(
    { method: 'GET', url: '**/haku/1.1.1.1.1.1' },
    { body: hakuItem }
  );

  cy.intercept({ method: 'GET', url: `**/toteutus/list**` }, { body: [] });

  cy.intercept({ method: 'GET', url: `**/koulutus/list**` }, { body: [] });

  cy.intercept({ method: 'GET', url: `**/search/haku/**` }, { body: [] });

  stubHakemuspalveluLomakkeetRoute();
  stubOppijanumerorekisteriHenkiloRoute();
};
