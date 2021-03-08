import _ from 'lodash';

import organisaatio from '#/cypress/data/organisaatio';
import organisaatioHierarkia from '#/cypress/data/organisaatioHierarkia';
import { stubCommonRoutes } from '#/cypress/utils';

export const stubToteutusFormRoutes = ({ organisaatioOid }) => {
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
      body: _.merge(organisaatio(), {
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
        _.merge(organisaatio(), {
          oid: organisaatioOid,
        }),
      ],
    }
  );

  cy.intercept({ method: 'GET', url: '**/toteutus/list**' }, { body: [] });

  cy.intercept({ method: 'GET', url: '**/sorakuvaus/list**' }, { body: [] });

  cy.intercept(
    { method: 'GET', url: '**/ammattinimike/search/**' },
    { body: [] }
  );

  cy.intercept({ method: 'GET', url: '**/asiasana/search/**' }, { body: [] });
};
