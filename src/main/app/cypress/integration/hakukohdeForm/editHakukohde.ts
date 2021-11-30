import { merge } from 'lodash/fp';

import organisaatio from '#/cypress/data/organisaatio';
import {
  prepareTest,
  fillJarjestyspaikkaSection,
} from '#/cypress/hakukohdeFormUtils';
import {
  assertNoUnsavedChangesDialog,
  confirmDelete,
  fillKieliversiotSection,
  fillTilaSection,
  tallenna,
  wrapMutationTest,
} from '#/cypress/utils';
import { ENTITY, OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';

export const editHakukohdeForm = () => {
  const organisaatioOid = '1.2.246.562.10.52251087186';
  const hakuOid = '4.1.1.1.1.1';
  const hakukohdeOid = '6.1.1.1.1.1';

  const mutationTest = wrapMutationTest({
    oid: hakukohdeOid,
    entity: ENTITY.HAKUKOHDE,
  });

  it(
    'should be able to edit hakukohde',
    mutationTest(() => {
      prepareTest({
        tyyppi: 'yo',
        hakuOid,
        hakukohdeOid,
        organisaatioOid,
        edit: true,
        tarjoajat: ['1.2.246.562.10.45854578546'],
      });

      fillKieliversiotSection();
      fillJarjestyspaikkaSection();
      tallenna();
    })
  );

  it(
    'should be able to delete hakukohde',
    mutationTest(() => {
      prepareTest({
        tyyppi: 'yo',
        hakuOid,
        hakukohdeOid,
        organisaatioOid,
        edit: true,
        tarjoajat: ['1.2.246.562.10.45854578546'],
      });

      fillKieliversiotSection();
      fillJarjestyspaikkaSection();
      fillTilaSection('poistettu');
      tallenna();
      confirmDelete();
    })
  );

  it("Shouldn't complain about unsaved changes for untouched form", () => {
    prepareTest({
      tyyppi: 'amm',
      hakuOid,
      hakukohdeOid,
      organisaatioOid,
      edit: true,
      tarjoajat: ['1.2.246.562.10.45854578546'],
    });
    assertNoUnsavedChangesDialog();
  });

  it('Should redirect from url without organization', () => {
    prepareTest({
      tyyppi: 'amm',
      hakuOid,
      hakukohdeOid,
      organisaatioOid,
      edit: true,
      tarjoajat: ['1.2.246.562.10.45854578546'],
    });

    cy.intercept(
      {
        method: 'POST',
        url: '**/organisaatio-service/rest/organisaatio/v4/findbyoids',
      },
      {
        body: [
          merge(organisaatio(), {
            oid: organisaatioOid,
          }),
        ],
      }
    );

    cy.visit(`/hakukohde/${hakukohdeOid}/muokkaus`);

    cy.url().should(
      'include',
      `/organisaatio/${OPETUSHALLITUS_ORGANISAATIO_OID}/hakukohde/${hakukohdeOid}/muokkaus`
    );
  });
};
