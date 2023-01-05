import { playMocks } from 'kto-ui-common/cypress/mockUtils';
import { merge } from 'lodash/fp';

import organisaatio from '#/cypress/data/organisaatio';
import hakuMocks from '#/cypress/mocks/haku.mocks.json';

import {
  stubHakemuspalveluLomakkeetRoute,
  stubOppijanumerorekisteriHenkiloRoute,
  stubCommonRoutes,
} from './utils';
import organisaatioHierarkia from "#/cypress/data/organisaatioHierarkia";

export const stubHakuFormRoutes = ({ organisaatioOid }) => {
  stubCommonRoutes();
  playMocks(hakuMocks);

  cy.intercept(
    {
      method: 'GET',
      url: `**/organisaatio-service/rest/organisaatio/v4/hierarkia/hae**oid=${organisaatioOid}**`,
    },
    { body: organisaatioHierarkia({ rootOid: organisaatioOid }) }
  );

  cy.intercept(
    {
      method: 'GET',
      url: `**/organisaatio-service/rest/organisaatio/v4/hierarkia/hae**`,
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

  cy.intercept({ method: 'GET', url: '**/haku/list**' }, { body: [] });

  cy.intercept({ method: 'GET', url: `**/toteutus/list**` }, { body: [] });

  cy.intercept({ method: 'GET', url: `**/koulutus/list**` }, { body: [] });

  cy.intercept({ method: 'GET', url: `**/search/haku/**` }, { body: [] });

  stubHakemuspalveluLomakkeetRoute();
  stubOppijanumerorekisteriHenkiloRoute();
};
