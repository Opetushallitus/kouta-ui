import autoRecord from 'cypress-autorecord';
import {
  prepareTest,
  fillJarjestyspaikkaSection,
} from '#/cypress/hakukohdeFormUtils';
import { fillKieliversiotSection, tallenna } from '#/cypress/utils';

export const editHakukohdeForm = () => {
  const organisaatioOid = '1.2.246.562.10.52251087186';
  const hakuOid = '4.1.1.1.1.1';
  const hakukohdeOid = '6.1.1.1.1.1';
  autoRecord();

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
};
