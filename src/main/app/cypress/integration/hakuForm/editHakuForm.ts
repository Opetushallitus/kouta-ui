import _ from 'lodash';

import haku from '#/cypress/data/haku';
import { stubHakuFormRoutes } from '#/cypress/hakuFormUtils';
import {
  assertNoUnsavedChangesDialog,
  fillKieliversiotSection,
  tallenna,
} from '#/cypress/utils';
import { OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';

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
        body: _.merge(haku(), {
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

  it("Shouldn't complain about unsaved changes for untouched form", () => {
    cy.visit(`/organisaatio/${organisaatioOid}/haku/${hakuOid}/muokkaus`);
    assertNoUnsavedChangesDialog();
  });

  it('Should redirect from url without organization', () => {
    cy.visit(`/haku/${hakuOid}/muokkaus`);
    cy.url().should(
      'include',
      `/organisaatio/${OPETUSHALLITUS_ORGANISAATIO_OID}/haku/${hakuOid}/muokkaus`
    );
  });
};
