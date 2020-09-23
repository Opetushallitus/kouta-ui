import _ from 'lodash';
import {
  typeToEditor,
  getCheckbox,
  fillKoulutustyyppiSelect,
  getByTestId,
  jatka,
  paste,
  fillKieliversiotSection,
  fillPohjaSection,
  fillTilaSection,
  tallenna,
} from '#/cypress/utils';

import createSoraKuvaus from '#/cypress/data/soraKuvaus';
import { stubSoraKuvausFormRoutes } from '#/cypress/soraKuvausFormUtils';

const fillKoulutustyyppiSection = () => {
  getByTestId('koulutustyyppiSection').within(() => {
    fillKoulutustyyppiSelect(['amm']);
    jatka();
  });
};

const fillTiedotSection = () => {
  getByTestId('tiedotSection').within(() => {
    getByTestId('nimi').find('input').pipe(paste('Nimi'));

    getByTestId('kuvaus').within(() => {
      typeToEditor('Kuvaus');
    });

    jatka();
  });
};

const fillJulkisuusSection = () => {
  getByTestId('julkinenSection').within(() => {
    getCheckbox(null).check({ force: true });
    jatka();
  });
};

describe('createSoraKuvausForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const soraKuvaus = createSoraKuvaus();

  beforeEach(() => {
    cy.server();
    stubSoraKuvausFormRoutes({ organisaatioOid });

    cy.route({
      method: 'GET',
      url: `**/sorakuvaus/${soraKuvaus.id}`,
      response: _.merge({}, soraKuvaus, {
        organisaatioOid,
      }),
    });

    cy.visit(`/organisaatio/${organisaatioOid}/sora-kuvaus/kielivalinnat/`);
  });

  it('should be able to create sora-kuvaus', () => {
    cy.route({
      method: 'PUT',
      url: '**/sorakuvaus',
      response: {
        id: soraKuvaus.id,
      },
    }).as('createSoraKuvausRequest');

    fillKoulutustyyppiSection();
    fillPohjaSection();
    fillKieliversiotSection({ jatka: true });
    fillTiedotSection();
    fillJulkisuusSection();
    fillTilaSection();

    tallenna();

    cy.wait('@createSoraKuvausRequest').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });

    cy.location('pathname').should(
      'eq',
      `/kouta/organisaatio/${organisaatioOid}/sora-kuvaus/${soraKuvaus.id}/muokkaus`
    );
  });
});
