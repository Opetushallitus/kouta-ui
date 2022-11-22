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

  cy.intercept({ method: 'GET', url: '**/toteutus/list**' }, { body: [] });

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
