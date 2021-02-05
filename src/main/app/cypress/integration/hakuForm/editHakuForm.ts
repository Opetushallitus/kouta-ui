import { merge } from 'lodash';

import haku from '#/cypress/data/haku';
import { stubHakuFormRoutes } from '#/cypress/hakuFormUtils';
import {
  assertNoUnsavedChangesDialog,
  fillKieliversiotSection,
  tallenna,
} from '#/cypress/utils';

const organisaatioOid = '1.1.1.1.1.1';
const hakuOid = '2.1.1.1.1.1';

export const editHakuForm = () => {
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
  });

  it('should be able to edit haku', () => {
    cy.visit(`/organisaatio/${organisaatioOid}/haku/${hakuOid}/muokkaus`);
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
    cy.visit(`/organisaatio/${organisaatioOid}/haku/${hakuOid}/muokkaus`);
    assertNoUnsavedChangesDialog();
  });

  it('Should redirect from url without organization', () => {
    cy.visit(`/haku/${hakuOid}/muokkaus`);
    cy.url().should(
      'include',
      `/organisaatio/${organisaatioOid}/haku/${hakuOid}/muokkaus`
    );
  });
};
