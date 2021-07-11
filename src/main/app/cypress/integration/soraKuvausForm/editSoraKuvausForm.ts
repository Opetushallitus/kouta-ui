import { playMocks } from 'kto-ui-common/cypress/mockUtils';
import _ from 'lodash';

import createSoraKuvaus from '#/cypress/data/soraKuvaus';
import soraKuvausMocks from '#/cypress/mocks/soraKuvaus.mock.json';
import { stubSoraKuvausFormRoutes } from '#/cypress/soraKuvausFormUtils';
import {
  assertNoUnsavedChangesDialog,
  fillKieliversiotSection,
  tallenna,
  wrapMutationTest,
} from '#/cypress/utils';
import { ENTITY, OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';

const soraKuvausId = '123e4567-e89b-12d3-a456-426655440000';
const organisaatioOid = '1.1.1.1.1.1';

export const editSoraKuvausForm = () => {
  const soraKuvaus = createSoraKuvaus({ id: soraKuvausId });

  beforeEach(() => {
    playMocks(soraKuvausMocks);
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

  const mutationTest = wrapMutationTest({
    id: soraKuvausId,
    entity: ENTITY.SORA_KUVAUS,
  });

  it(
    'should be able to edit sora-kuvaus',
    mutationTest(() => {
      fillKieliversiotSection();
      tallenna();
    })
  );

  it("Shouldn't complain about unsaved changes for untouched form", () => {
    assertNoUnsavedChangesDialog();
  });

  it('Should redirect from url without organization', () => {
    cy.visit(`/sora-kuvaus/${soraKuvausId}/muokkaus`);
    cy.url().should(
      'include',
      `/organisaatio/${OPETUSHALLITUS_ORGANISAATIO_OID}/sora-kuvaus/${soraKuvausId}/muokkaus`
    );
  });
};
