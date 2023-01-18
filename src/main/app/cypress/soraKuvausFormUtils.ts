import { merge } from 'lodash/fp';

import organisaatio from '#/cypress/data/organisaatio';
import {
  stubOppijanumerorekisteriHenkiloRoute,
  stubCommonRoutes,
  koutaSearchItem,
} from '#/cypress/utils';

export const stubSoraKuvausFormRoutes = ({ organisaatioOid }) => {
  stubCommonRoutes();

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

  const soraItem = merge(koutaSearchItem({ idProp: 'id' }), {
    nimi: {
      fi: 'Sorakuvauksen nimi',
    },
    tila: 'julkaistu',
  });

  cy.intercept(
    { method: 'GET', url: '**/sorakuvaus/list**' },
    { body: [soraItem] }
  );

  cy.intercept(
    { method: 'GET', url: '**/sorakuvaus/1.1.1.1.1.1' },
    { body: soraItem }
  );

  stubOppijanumerorekisteriHenkiloRoute();
};
