import { merge } from 'lodash/fp';

import oppilaitoksetFlat from '#/cypress/data/oppilaitoksetFlat';
import organisaatio from '#/cypress/data/organisaatio';
import organisaatioHierarkia from '#/cypress/data/organisaatioHierarkia';
import soraKuvaus from '#/cypress/data/soraKuvaus';
import {
  stubOppijanumerorekisteriHenkiloRoute,
  stubCommonRoutes,
} from '#/cypress/utils';

export const stubKoulutusFormRoutes = ({ organisaatioOid }) => {
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
      method: 'GET',
      url: `**/kouta-backend/organisaatio/oppilaitokset-for-avoin-korkeakoulutus`,
    },
    { body: oppilaitoksetFlat({ rootOid: organisaatioOid }) }
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
        merge(soraKuvaus(), {
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
      body: merge(soraKuvaus(), {
        nimi: { fi: `Sora-kuvaus 1` },
        id: 1,
        tila: 'julkaistu',
      }),
    }
  );

  cy.intercept({ method: 'GET', url: '**/koulutus/list**' }, { body: [] });
  cy.intercept({ method: 'GET', url: '**/search/koulutus/**' }, { body: [] });

  stubOppijanumerorekisteriHenkiloRoute();
};
