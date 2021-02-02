import _ from 'lodash';
import { playMockFile } from 'kto-ui-common/cypress/mockUtils';
import createSoraKuvaus from '#/cypress/data/soraKuvaus';
import { stubSoraKuvausFormRoutes } from '#/cypress/soraKuvausFormUtils';
import {
  assertNoUnsavedChangesDialog,
  fillKieliversiotSection,
  tallenna,
} from '#/cypress/utils';

export const editSoraKuvausForm = () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const soraKuvaus = createSoraKuvaus();

  beforeEach(() => {
    playMockFile('soraKuvaus.mock.json');
    stubSoraKuvausFormRoutes({ organisaatioOid });

    cy.intercept(
      { method: 'GET', url: `**/sorakuvaus/${soraKuvaus.id}` },
      {
        body: _.merge({}, soraKuvaus, {
          organisaatioOid,
        }),
      }
    );

    cy.visit(
      `/organisaatio/${organisaatioOid}/sora-kuvaus/${soraKuvaus.id}/muokkaus`
    );
  });

  it('should be able to edit sora-kuvaus', () => {
    cy.intercept(
      { method: 'POST', url: '**/sorakuvaus' },
      {
        body: {
          muokattu: false,
        },
      }
    ).as('editSoraKuvausRequest');

    fillKieliversiotSection();
    tallenna();

    cy.wait('@editSoraKuvausRequest').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

  it("Shouldn't complain about unsaved changed for untouched form", () => {
    assertNoUnsavedChangesDialog();
  });
};
