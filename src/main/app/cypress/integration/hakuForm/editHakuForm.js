import merge from 'lodash/merge';

import { getByTestId, chooseKieliversiotLanguages } from '../../utils';
import { stubHakuFormRoutes } from '../../hakuFormUtils';

import haku from '../../data/haku';

const fillKieliversiotSection = cy => {
  getByTestId('kieliversiotSection', cy).within(() => {
    chooseKieliversiotLanguages(['fi'], cy);
  });
};

const tallenna = cy => {
  getByTestId('tallennaHakuButton', cy).click();
};

describe('editHakuForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const hakuOid = '2.1.1.1.1.1';

  beforeEach(() => {
    cy.server();

    stubHakuFormRoutes({ organisaatioOid, cy });

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

    cy.visit(`/haku/${hakuOid}/muokkaus`);
  });

  it('should be able to edit haku', () => {
    cy.route({
      method: 'GET',
      url: `**/haku/${hakuOid}`,
      response: merge(haku(), {
        oid: hakuOid,
        organisaatioOid: organisaatioOid,
      }),
    });

    cy.route({
      method: 'POST',
      url: '**/haku',
      response: {
        muokattu: false,
      },
    }).as('editHakuRequest');

    fillKieliversiotSection(cy);

    tallenna(cy);

    cy.wait('@editHakuRequest').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });
  });
});
