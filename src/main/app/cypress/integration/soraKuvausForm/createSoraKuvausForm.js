import {
  chooseKieliversiotLanguages,
  typeToEditor,
  getCheckbox,
  fillKoulutustyyppiSelect,
} from '../../utils';

import createSoraKuvaus from '../../data/soraKuvaus';
import { stubSoraKuvausFormRoutes } from '../../soraKuvausFormUtils';

const jatka = cy => {
  cy.getByTestId('jatkaButton').click({ force: true });
};

const fillKoulutustyyppiSection = cy => {
  cy.getByTestId('tyyppiSection').within(() => {
    fillKoulutustyyppiSelect(['amm'], cy);
  });
};

const fillPohjaSection = cy => {
  cy.getByTestId('pohjaSection').within(() => {
    jatka(cy);
  });
};

const fillKieliversiotSection = cy => {
  cy.getByTestId('kieliversiotSection').within(() => {
    chooseKieliversiotLanguages(['fi'], cy);
    jatka(cy);
  });
};

const fillTiedotSection = cy => {
  cy.getByTestId('tiedotSection').within(() => {
    cy.getByTestId('nimi')
      .find('input')
      .type('Nimi', { force: true });

    cy.getByTestId('kuvaus').within(() => {
      typeToEditor('Kuvaus', cy);
    });

    jatka(cy);
  });
};

const fillJulkisuusSection = cy => {
  cy.getByTestId('julkisuusSection').within(() => {
    getCheckbox(null, cy).check({ force: true });
  });
};

const tallenna = cy => {
  cy.getByTestId('tallennaJaJulkaiseSoraKuvausButton').click({ force: true });
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

    cy.visit(`/organisaatio/${organisaatioOid}/sora-kuvaus`);
  });

  it('should be able to create sora-kuvaus', () => {
    cy.route({
      method: 'PUT',
      url: '**/sora-kuvaus',
      response: {
        id: soraKuvaus.id,
      },
    }).as('createSoraKuvausRequest');

    fillKoulutustyyppiSection(cy);
    fillPohjaSection(cy);
    fillKieliversiotSection(cy);
    fillTiedotSection(cy);
    fillJulkisuusSection(cy);

    tallenna(cy);

    cy.wait('@createSoraKuvausRequest').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });
  });
});
