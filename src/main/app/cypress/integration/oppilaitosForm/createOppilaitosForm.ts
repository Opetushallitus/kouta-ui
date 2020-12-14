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

import { stubOppilaitosFormRoutes } from '#/cypress/oppilaitosFormUtils';

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
    selectOption('organisaationkuvaustiedot_0');
    typeToEditor('Tietoa');
    jatka();
  });
};

const fillYhteystiedotSection = () => {
  getByTestId('yhteystiedotSection').within(() => {
    getByTestId('osoite').find('input').pipe(paste('Osoite'));

    getByTestId('postinumero').within(() => {
      fillAsyncSelect('0', 'Posti_0');
    });

    getByTestId('sahkoposti')
      .find('input')
      .pipe(paste('sahkoposti@sahkoposti.fi'));

    getByTestId('puhelinnumero').find('input').pipe(paste('12345'));

    getByTestId('verkkosivu').find('input').pipe(paste('www.verkkosivu.fi'));

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
    cy.server();
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

    fillKieliversiotSection({ jatka: true });

    fillPerustiedotSection();

    fillEsittelySection();

    fillTeemakuvaSection();

    passOsatSection();

    fillTietoaOpiskelustaSection();

    fillTilaSection();

    fillYhteystiedotSection();

    tallenna();

    cy.wait('@createOppilaitosResponse').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });
};
