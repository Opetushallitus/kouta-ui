import { stubOppilaitosFormRoutes } from '#/cypress/oppilaitosFormUtils';
import {
  fillAsyncSelect,
  selectOption,
  typeToEditor,
  getByTestId,
  jatka,
  paste,
  fillKieliversiotSection,
  fillTilaSection,
  tallenna,
} from '#/cypress/utils';

const fillPerustiedotSection = () => {
  getByTestId('perustiedotSection').within(() => {
    getByTestId('opiskelijoita').find('input').pipe(paste('1'));
    getByTestId('korkeakouluja').find('input').pipe(paste('2'));
    getByTestId('tiedekuntia').find('input').pipe(paste('3'));
    getByTestId('kampuksia').find('input').pipe(paste('4'));
    getByTestId('yksikoita').find('input').pipe(paste('5'));
    getByTestId('toimipisteita').find('input').pipe(paste('6'));
    getByTestId('akatemioita').find('input').pipe(paste('7'));

    jatka();
  });
};

const fillEsittelySection = () => {
  getByTestId('esittelySection').within(() => {
    typeToEditor('Esittely');

    jatka();
  });
};

const fillTeemakuvaSection = () => {
  getByTestId('teemakuvaSection').within(() => {
    jatka();
  });
};

const fillTietoaOpiskelustaSection = () => {
  getByTestId('tietoaSection').within(() => {
    selectOption('Opintojen rahoitus');
    typeToEditor('Tietoa');
    jatka();
  });
};

const fillYhteystiedotSection = () => {
  getByTestId('yhteystiedotSection').within(() => {
    getByTestId('lisaaYhteystietoButton').click({ force: true });
    cy.findByLabelText(/oppilaitoslomake\.yhteystiedonNimi/).pipe(
      paste('Yhteystiedon nimi')
    );

    cy.findByLabelText(/yleiset.postiosoite/).pipe(paste('Osoite'));

    // NOTE: postinumeros are with testIds for they share the same translationkey
    getByTestId('postinumero').within(() => {
      fillAsyncSelect('00350');
    });

    cy.findByLabelText(/yleiset.kayntiosoite/).pipe(paste('Osoite'));

    getByTestId('kayntiosoitePostinumero').within(() => {
      fillAsyncSelect('00350');
    });

    cy.findByLabelText(/yleiset.sahkoposti/).pipe(
      paste('sahkoposti@sahkoposti.fi')
    );

    cy.findByLabelText(/yleiset.puhelinnumero/).pipe(paste('12345'));

    cy.findByLabelText(/yleiset.verkkosivu/).pipe(paste('www.verkkosivu.fi'));

    jatka();
  });
};

const skipHakijapalveluidenYhteystiedotSection = () => {
  getByTestId('hakijapalveluidenYhteystiedotSection').within(() => {
    jatka();
  });
};

const fillHakijapalveluidenYhteystiedotSection = () => {
  getByTestId('hakijapalveluidenYhteystiedotSection').within(() => {
    cy.findByLabelText(/oppilaitoslomake\.yhteystiedonNimi/).pipe(
      paste('Testihakijapalvelu')
    );

    cy.findByLabelText(/yleiset.postiosoite/).pipe(paste('Osoite'));

    // NOTE: postinumeros are with testIds for they share the same translationkey
    getByTestId('postinumero').within(() => {
      fillAsyncSelect('00350');
    });

    cy.findByLabelText(/yleiset.kayntiosoite/).pipe(paste('Osoite'));

    getByTestId('kayntiosoitePostinumero').within(() => {
      fillAsyncSelect('00350');
    });

    cy.findByLabelText(/yleiset.sahkoposti/).pipe(
      paste('sahkoposti@sahkoposti.fi')
    );

    cy.findByLabelText(/yleiset.puhelinnumero/).pipe(paste('12345'));

    cy.findByLabelText(/yleiset.verkkosivu/).pipe(paste('www.verkkosivu.fi'));

    jatka();
  });
};

const passOsatSection = () => {
  getByTestId('oppilaitoksenOsatSection').within(() => {
    jatka();
  });
};

export const createOppilaitosForm = () => {
  const organisaatioOid = '1.1.1.1.1.1';

  beforeEach(() => {
    stubOppilaitosFormRoutes({ organisaatioOid });

    cy.intercept(
      { method: 'GET', url: `**/oppilaitos/${organisaatioOid}` },
      { body: '' }
    );

    cy.visit(`/organisaatio/${organisaatioOid}/oppilaitos`);
  });

  it('should be able to create oppilaitos without hakijapalveluyhteystiedot', () => {
    cy.intercept(
      { method: 'PUT', url: '**/oppilaitos' },
      {
        body: {
          oid: '1.2.3.4.5.6',
        },
      }
    ).as('createOppilaitosResponse');

    fillKieliversiotSection({ jatka: true });

    fillPerustiedotSection();

    fillEsittelySection();

    fillTeemakuvaSection();

    passOsatSection();

    fillTietoaOpiskelustaSection();

    fillTilaSection();

    fillYhteystiedotSection();

    skipHakijapalveluidenYhteystiedotSection();

    tallenna();

    cy.wait('@createOppilaitosResponse').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

  it('should be able to create oppilaitos with hakijapalveluyhteystiedot', () => {
    cy.intercept(
      { method: 'PUT', url: '**/oppilaitos' },
      {
        body: {
          oid: '1.2.3.4.5.6',
        },
      }
    ).as('createOppilaitosResponse');

    fillKieliversiotSection({ jatka: true });

    getByTestId('yhteystiedotSection').click();

    fillYhteystiedotSection();

    fillHakijapalveluidenYhteystiedotSection();

    tallenna();

    cy.wait('@createOppilaitosResponse').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });
};
