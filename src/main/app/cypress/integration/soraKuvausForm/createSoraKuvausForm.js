import {
  chooseKieliversiotLanguages,
  typeToEditor,
  getCheckbox,
  fillKoulutustyyppiSelect,
  getRadio,
} from '../../utils';

import createSoraKuvaus from '../../data/soraKuvaus';
import { stubSoraKuvausFormRoutes } from '../../soraKuvausFormUtils';

const jatka = () => {
  cy.getByTestId('jatkaButton').click({ force: true });
};

const fillKoulutustyyppiSection = () => {
  cy.getByTestId('tyyppiSection').within(() => {
    fillKoulutustyyppiSelect(['amm'], cy);
  });
};

const fillPohjaSection = () => {
  cy.getByTestId('pohjaSection').within(() => {
    jatka();
  });
};

const fillKieliversiotSection = () => {
  cy.getByTestId('kieliversiotSection').within(() => {
    chooseKieliversiotLanguages(['fi'], cy);
    jatka();
  });
};

const fillTiedotSection = () => {
  cy.getByTestId('tiedotSection').within(() => {
    cy.getByTestId('nimi')
      .find('input')
      .type('Nimi', { force: true });

    cy.getByTestId('kuvaus').within(() => {
      typeToEditor('Kuvaus', cy);
    });

    jatka();
  });
};

const fillJulkisuusSection = () => {
  cy.getByTestId('julkisuusSection').within(() => {
    getCheckbox(null, cy).check({ force: true });
    jatka();
  });
};

const tallenna = () => {
  cy.getByTestId('tallennaSoraKuvausButton').click({ force: true });
};

const fillTilaSection = (tila = 'julkaistu') => {
  cy.getByTestId('tilaSection').within(() => {
    getRadio(tila, cy).check({ force: true });
  });
};

describe('createSoraKuvausForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const soraKuvaus = createSoraKuvaus();

  beforeEach(() => {
    stubSoraKuvausFormRoutes({ cy, organisaatioOid });

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
      cy.wrap(request.body).snapshot();
    });

    cy.location('pathname').should(
      'eq',
      `/kouta/organisaatio/${organisaatioOid}/sora-kuvaus/${
        soraKuvaus.id
      }/muokkaus`,
    );
  });
});
