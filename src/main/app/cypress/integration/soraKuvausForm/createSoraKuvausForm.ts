import _ from 'lodash';
import {
  typeToEditor,
  getByTestId,
  jatka,
  paste,
  fillKieliversiotSection,
  fillPohjaSection,
  fillTilaSection,
  tallenna,
  fillKoulutustyyppiSelect,
  fillAsyncSelect,
} from '#/cypress/utils';

import createSoraKuvaus from '#/cypress/data/soraKuvaus';
import { stubSoraKuvausFormRoutes } from '#/cypress/soraKuvausFormUtils';
import { addMockFileRoutes } from '#/cypress/mockUtils';

const fillKoulutustyyppiSection = () => {
  getByTestId('koulutustyyppiSection').within(() => {
    fillKoulutustyyppiSelect(['amm']);
    cy.findByTestId('koulutusala').within(() => {
      fillAsyncSelect('Arkkitehtuuri ja rakentaminen');
    });

    cy.findByTestId('koulutukset').within(() => {
      fillAsyncSelect('Rakennusarkkitehti (AMK)');
    });
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
export const createSoraKuvausForm = () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const soraKuvaus = createSoraKuvaus();

  beforeEach(() => {
    cy.server();
    addMockFileRoutes('soraKuvaus.mock.json');
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
};
