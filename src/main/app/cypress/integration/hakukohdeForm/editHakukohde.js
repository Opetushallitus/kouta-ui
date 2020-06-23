import { getByTestId, chooseKieliversiotLanguages } from '#/cypress/utils';
import { prepareTest } from '#/cypress/hakukohdeFormUtils';

const fillKieliversiotSection = () => {
  getByTestId('kieliversiotSection').within(() => {
    chooseKieliversiotLanguages(['fi']);
  });
};

const tallenna = () => {
  getByTestId('tallennaHakukohdeButton').click();
};

describe('editHakukohdeForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const hakuOid = '4.1.1.1.1.1';
  const hakukohdeOid = '6.1.1.1.1.1';

  it('should be able to edit hakukohde', () => {
    prepareTest({
      tyyppi: 'amm',
      hakuOid,
      hakukohdeOid,
      organisaatioOid,
      edit: true,
    });

    fillKieliversiotSection();
    tallenna();

    cy.wait('@updateHakukohdeRequest').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });
});
