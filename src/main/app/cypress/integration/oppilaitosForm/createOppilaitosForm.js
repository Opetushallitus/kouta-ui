import {
  fillAsyncSelect,
  chooseKieliversiotLanguages,
  selectOption,
  typeToEditor,
  getRadio,
} from '../../utils';

import { stubOppilaitosFormRoutes } from '../../oppilaitosFormUtils';

const jatka = () => {
  cy.getByTestId('jatkaButton').click({ force: true });
};

const fillTilaSection = (tila = 'julkaistu') => {
  cy.getByTestId('tilaSection').within(() => {
    getRadio(tila, cy).check({ force: true });
  });
};

const fillKieliversiotSection = () => {
  cy.getByTestId('kieliversiotSection').within(() => {
    chooseKieliversiotLanguages(['fi'], cy);
    cy.getByTestId('jatkaButton').click({ force: true });
  });
};

const fillPerustiedotSection = () => {
  cy.getByTestId('perustiedotSection').within(() => {
    cy.getByTestId('opiskelijoita')
      .find('input')
      .type('1', { force: true });
    cy.getByTestId('korkeakouluja')
      .find('input')
      .type('2', { force: true });
    cy.getByTestId('tiedekuntia')
      .find('input')
      .type('3', { force: true });
    cy.getByTestId('kampuksia')
      .find('input')
      .type('4', { force: true });
    cy.getByTestId('yksikoita')
      .find('input')
      .type('5', { force: true });
    cy.getByTestId('toimipisteita')
      .find('input')
      .type('6', { force: true });
    cy.getByTestId('akatemioita')
      .find('input')
      .type('7', { force: true });

    jatka();
  });
};

const fillEsittelySection = () => {
  cy.getByTestId('esittelySection').within(() => {
    typeToEditor('Esittely', cy);

    jatka();
  });
};

const fillTietoaOpiskelustaSection = () => {
  cy.getByTestId('tietoaOpiskelustaSection').within(() => {
    selectOption('koulutuksenlisatiedot_0', cy);

    cy.get('textarea').type('Tietoa', { force: true });

    jatka();
  });
};

const fillYhteystiedotSection = () => {
  cy.getByTestId('yhteystiedotSection').within(() => {
    cy.getByTestId('osoite')
      .find('input')
      .type('Osoite', { force: true });

    cy.getByTestId('postinumero').within(() => {
      fillAsyncSelect('0', 'Posti_0');
    });

    cy.getByTestId('sahkoposti')
      .find('input')
      .type('sahkoposti@sahkoposti.fi', { force: true });

    cy.getByTestId('puhelinnumero')
      .find('input')
      .type('12345', { force: true });

    cy.getByTestId('verkkosivu')
      .find('input')
      .type('www.verkkosivu.fi', { force: true });

    jatka();
  });
};

const tallenna = () => {
  cy.getByTestId('tallennaOppilaitosButton').click({ force: true });
};

describe('createOppilaitosForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';

  beforeEach(() => {
    stubOppilaitosFormRoutes({ organisaatioOid });

    cy.route({
      method: 'GET',
      url: `**/oppilaitos/${organisaatioOid}`,
      response: '',
    });

    cy.visit(`/organisaatio/${organisaatioOid}/oppilaitos`);
  });

  it('should be able to create oppilaitos', () => {
    cy.route({
      method: 'PUT',
      url: '**/oppilaitos',
      response: {
        oid: '1.2.3.4.5.6',
      },
    }).as('createOppilaitosResponse');

    fillKieliversiotSection();

    fillPerustiedotSection();

    fillEsittelySection();

    fillTietoaOpiskelustaSection();

    fillTilaSection();

    fillYhteystiedotSection();

    tallenna();

    cy.wait('@createOppilaitosResponse').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });
  });
});
