import { merge } from 'lodash/fp';

import organisaatio from '#/cypress/data/organisaatio';
import organisaatioHierarkia from '#/cypress/data/organisaatioHierarkia';
import toteutusListItems from '#/cypress/data/toteutusListItems';
import { stubCommonRoutes } from '#/cypress/utils';

export const stubToteutusFormRoutes = ({ organisaatioOid }) => {
  stubCommonRoutes();

  cy.intercept(
    { method: 'GET', url: '**/koodisto-service/rest/json/osaamisala/koodi**' },
    { fixture: 'osaamisala-koodisto.json' }
  );

  cy.intercept({ method: 'GET', url: `**/haku/list**` }, { body: [] });

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

  cy.intercept(
    { method: 'GET', url: '**/toteutus/list**' },
    { body: toteutusListItems(organisaatioOid) }
  );

  cy.intercept(
    { method: 'GET', url: '**/toteutus/1.2.246.562.17.00000000000000008265' },
    { body: toteutusListItems(organisaatioOid)[0] }
  );

  cy.intercept(
    { method: 'GET', url: '**/toteutus/opintojaksot/list**' },
    { body: toteutusListItems(organisaatioOid) }
  );

  cy.intercept({ method: 'GET', url: '**/sorakuvaus/list**' }, { body: [] });

  cy.intercept(
    { method: 'GET', url: '**/ammattinimike/search/**' },
    { body: [] }
  );

  cy.intercept({ method: 'GET', url: '**/asiasana/search/**' }, { body: [] });

  cy.intercept({ method: 'GET', url: '**/search/toteutus/**' }, { body: [] });
};
