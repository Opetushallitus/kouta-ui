import {
  chooseKieliversiotLanguages,
  typeToEditor,
  getCheckbox,
  fillKoulutustyyppiSelect,
  getRadio,
  getByTestId,
  jatka,
  paste,
} from '#/cypress/utils';

import createSoraKuvaus from '#/cypress/data/soraKuvaus';
import { stubSoraKuvausFormRoutes } from '#/cypress/soraKuvausFormUtils';

const fillKoulutustyyppiSection = () => {
  getByTestId('koulutustyyppiSection').within(() => {
    fillKoulutustyyppiSelect(['amm']);
  });
};

const fillPohjaSection = () => {
  getByTestId('pohjaSection').within(() => {
    jatka();
  });
};

const fillKieliversiotSection = () => {
  getByTestId('kieliversiotSection').within(() => {
    chooseKieliversiotLanguages(['fi']);
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

const tallenna = () => {
  getByTestId('tallennaSoraKuvausButton').click();
};

const fillTilaSection = (tila = 'julkaistu') => {
  getByTestId('tilaSection').within(() => {
    getRadio(tila).check({ force: true });
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
      url: '**/sora-kuvaus/*',
      response: soraKuvaus,
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
    fillKieliversiotSection();
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
