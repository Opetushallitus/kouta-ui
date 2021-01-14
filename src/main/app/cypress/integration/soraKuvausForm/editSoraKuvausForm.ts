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
    cy.server();
    playMockFile('soraKuvaus.mock.json');
    stubSoraKuvausFormRoutes({ organisaatioOid });

    cy.route({
      method: 'GET',
      url: `**/sorakuvaus/${soraKuvaus.id}`,
      response: _.merge({}, soraKuvaus, {
        organisaatioOid,
      }),
    });

    cy.visit(
      `/organisaatio/${organisaatioOid}/sora-kuvaus/${soraKuvaus.id}/muokkaus`
    );
  });

  it('should be able to edit sora-kuvaus', () => {
    cy.route({
      method: 'POST',
      url: '**/sorakuvaus',
      response: {
        muokattu: false,
      },
    }).as('editSoraKuvausRequest');

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
