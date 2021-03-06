import _ from 'lodash';

import organisaatio from '#/cypress/data/organisaatio';
import organisaatioHierarkia from '#/cypress/data/organisaatioHierarkia';
import {
  stubOppijanumerorekisteriHenkiloRoute,
  stubCommonRoutes,
} from '#/cypress/utils';

import soraKuvaus from './data/soraKuvaus';

export const stubKoulutusFormRoutes = ({ organisaatioOid }) => {
  stubCommonRoutes();

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

  cy.intercept(
    {
      method: 'GET',
      url: `**/koulutus/list?organisaatioOid=${organisaatioOid}`,
    },
    { body: [] }
  );

  cy.intercept({ method: 'GET', url: `/koulutus/list` }, { body: [] });

  cy.intercept(
    { method: 'GET', url: `**/koulutus/*/toteutukset/list**` },
    { body: [] }
  );

  cy.intercept(
    { method: 'GET', url: '**/valintaperuste/list**' },
    { body: [] }
  );

  cy.intercept(
    { method: 'GET', url: '**/sorakuvaus/list**' },
    {
      body: [...new Array(10)].map((v, i) =>
        _.merge(soraKuvaus(), {
          nimi: { fi: `Sora-kuvaus ${i}` },
          id: i.toString(),
          tila: 'julkaistu',
        })
      ),
    }
  );

  cy.intercept(
    { method: 'GET', url: '**/sorakuvaus/1' },
    {
      body: _.merge(soraKuvaus(), {
        nimi: { fi: `Sora-kuvaus 1` },
        id: 1,
        tila: 'julkaistu',
      }),
    }
  );

  stubOppijanumerorekisteriHenkiloRoute();
};
