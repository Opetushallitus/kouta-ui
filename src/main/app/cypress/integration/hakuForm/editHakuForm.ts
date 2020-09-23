import { merge } from 'lodash';
import { fillKieliversiotSection, tallenna } from '#/cypress/utils';
import { stubHakuFormRoutes } from '#/cypress/hakuFormUtils';
import haku from '#/cypress/data/haku';

describe('editHakuForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const hakuOid = '2.1.1.1.1.1';

  beforeEach(() => {
    cy.server();
    stubHakuFormRoutes({ organisaatioOid });

    cy.route({
      method: 'GET',
      url: `**/haku/${hakuOid}/hakukohteet/list**`,
      response: [],
    });

    cy.route({
      method: 'GET',
      url: `**/toteutus/list**`,
      response: [],
    });

    cy.route({
      method: 'GET',
      url: `**/haku/${hakuOid}`,
      response: merge(haku(), {
        oid: hakuOid,
        organisaatioOid: organisaatioOid,
      }),
    });

    cy.visit(`/organisaatio/${organisaatioOid}/haku/${hakuOid}/muokkaus`);
  });

  it('should be able to edit haku', () => {
    cy.route({
      method: 'POST',
      url: '**/haku',
      response: {
        muokattu: false,
      },
    }).as('editHakuRequest');

    fillKieliversiotSection();

    tallenna();

    cy.wait('@editHakuRequest').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });
});
