import { playMocks } from 'kto-ui-common/cypress/mockUtils';
import { merge } from 'lodash/fp';

import organisaatioHierarkia from '#/cypress/data/organisaatioHierarkia';
import valintaperusteMocks from '#/cypress/mocks/valintaperuste.mock.json';

import organisaatio from './data/organisaatio';
import {
  stubOppijanumerorekisteriHenkiloRoute,
  stubCommonRoutes,
  koutaSearchItem,
} from './utils';

export const stubValintaperusteFormRoutes = ({ organisaatioOid }) => {
  playMocks(valintaperusteMocks);
  stubCommonRoutes();

  cy.intercept(
    {
      method: 'GET',
      url: `**/kouta-backend/organisaatio/hierarkia**`,
    },
    { body: organisaatioHierarkia({ rootOid: organisaatioOid }) }
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

  const valintaperusteItem = merge(koutaSearchItem({ idProp: 'id' }), {
    nimi: { fi: 'Valintaperusteen nimi' },
    tila: 'julkaistu',
  });

  cy.intercept(
    { method: 'GET', url: '**/valintaperuste/list**' },
    { body: [valintaperusteItem] }
  );

  cy.intercept(
    { method: 'GET', url: '**/valintaperuste/1.1.1.1.1.1' },
    { body: valintaperusteItem }
  );

  stubOppijanumerorekisteriHenkiloRoute();
};
