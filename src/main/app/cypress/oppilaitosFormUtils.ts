import { playMocks } from 'kto-ui-common/cypress/mockUtils';
import { merge } from 'lodash/fp';

import createOrganisaatio from '#/cypress/data/organisaatio';
import createOrganisaatioHierarkia from '#/cypress/data/organisaatioHierarkia';
import oppilaitosMocks from '#/cypress/mocks/oppilaitos.mocks.json';
import { stubCommonRoutes } from '#/cypress/utils';

export const stubOppilaitosFormRoutes = ({ organisaatioOid }) => {
  stubCommonRoutes();
  playMocks(oppilaitosMocks);

  cy.intercept(
    {
      method: 'POST',
      url: '**/organisaatio-service/rest/organisaatio/v4/findbyoids',
    },
    {
      body: [
        merge(createOrganisaatio(), {
          oid: organisaatioOid,
        }),
      ],
    }
  );

  cy.intercept(
    {
      method: 'GET',
      url: `**/organisaatio-service/rest/organisaatio/v4/hierarkia/hae**oid=${organisaatioOid}**`,
    },
    { body: createOrganisaatioHierarkia({ rootOid: organisaatioOid }) }
  );
};
