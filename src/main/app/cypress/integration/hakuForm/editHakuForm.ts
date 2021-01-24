import { merge } from 'lodash';

import {
  assertNoUnsavedChangesDialog,
  fillKieliversiotSection,
  tallenna,
} from '#/cypress/utils';
import { stubHakuFormRoutes } from '#/cypress/hakuFormUtils';
import haku from '#/cypress/data/haku';

export const editHakuForm = () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const hakuOid = '2.1.1.1.1.1';

  beforeEach(() => {
    stubHakuFormRoutes({ organisaatioOid });

    cy.intercept(
      { method: 'GET', url: `**/haku/${hakuOid}/hakukohteet/list**` },
      { body: [] }
    );

    cy.intercept({ method: 'GET', url: `**/toteutus/list**` }, { body: [] });

    cy.intercept(
      { method: 'GET', url: `**/haku/${hakuOid}` },
      {
        body: merge(haku(), {
          oid: hakuOid,
          organisaatioOid: organisaatioOid,
        }),
      }
    );

    cy.visit(`/organisaatio/${organisaatioOid}/haku/${hakuOid}/muokkaus`);
  });

  it('should be able to edit haku', () => {
    cy.intercept(
      { method: 'POST', url: '**/haku' },
      {
        body: {
          muokattu: false,
        },
      }
    ).as('editHakuRequest');

    fillKieliversiotSection();

    tallenna();

    cy.wait('@editHakuRequest').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

  it("Shouldn't complain about unsaved changed for untouched form", () => {
    assertNoUnsavedChangesDialog();
  });
};
