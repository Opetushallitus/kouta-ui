import {
  prepareTest,
  fillJarjestyspaikkaSection,
} from '#/cypress/hakukohdeFormUtils';
import {
  assertNoUnsavedChangesDialog,
  fillKieliversiotSection,
  tallenna,
} from '#/cypress/utils';

export const editHakukohdeForm = () => {
  const organisaatioOid = '1.2.246.562.10.52251087186';
  const hakuOid = '4.1.1.1.1.1';
  const hakukohdeOid = '6.1.1.1.1.1';

  it('should be able to edit hakukohde', () => {
    prepareTest({
      tyyppi: 'amm',
      hakuOid,
      hakukohdeOid,
      organisaatioOid,
      edit: true,
      tarjoajat: ['1.2.246.562.10.45854578546'],
    });

    fillKieliversiotSection();
    fillJarjestyspaikkaSection({
      jatka: false,
    });
    tallenna();

    cy.wait('@updateHakukohdeRequest').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

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
    cy.visit(`/hakukohde/${hakukohdeOid}/muokkaus`);
    cy.url().should(
      'include',
      `/organisaatio/${organisaatioOid}/hakukohde/${hakukohdeOid}/muokkaus`
    );
  });
};
