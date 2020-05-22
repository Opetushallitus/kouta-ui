import {
  fillAsyncSelect,
  chooseKieliversiotLanguages,
  selectOption,
  typeToEditor,
  getRadio,
  getByTestId,
  jatka,
} from '#/cypress/utils';

import { stubOppilaitosFormRoutes } from '#/cypress/oppilaitosFormUtils';

const fillTilaSection = (tila = 'julkaistu') => {
  getByTestId('tilaSection').within(() => {
    getRadio(tila).check({ force: true });
  });
};

const fillKieliversiotSection = () => {
  getByTestId('kieliversiotSection').within(() => {
    chooseKieliversiotLanguages(['fi']);
    jatka();
  });
};

const fillPerustiedotSection = () => {
  getByTestId('perustiedotSection').within(() => {
    getByTestId('opiskelijoita').find('input').paste('1');
    getByTestId('korkeakouluja').find('input').paste('2');
    getByTestId('tiedekuntia').find('input').paste('3');
    getByTestId('kampuksia').find('input').paste('4');
    getByTestId('yksikoita').find('input').paste('5');
    getByTestId('toimipisteita').find('input').paste('6');
    getByTestId('akatemioita').find('input').paste('7');

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

    cy.get('textarea').paste('Tietoa');

    jatka();
  });
};

const fillYhteystiedotSection = () => {
  getByTestId('yhteystiedotSection').within(() => {
    getByTestId('osoite').find('input').paste('Osoite');

    getByTestId('postinumero').within(() => {
      fillAsyncSelect('0', 'Posti_0');
    });

    getByTestId('sahkoposti').find('input').paste('sahkoposti@sahkoposti.fi');

    getByTestId('puhelinnumero').find('input').paste('12345');

    getByTestId('verkkosivu').find('input').paste('www.verkkosivu.fi');

    jatka();
  });
};

const tallenna = () => {
  getByTestId('tallennaOppilaitosButton').click();
};

describe('createOppilaitosForm', () => {
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

    fillKieliversiotSection();

    fillPerustiedotSection();

    fillEsittelySection();

    fillTeemakuvaSection();

    fillTietoaOpiskelustaSection();

    fillTilaSection();

    fillYhteystiedotSection();

    tallenna();

    cy.wait('@createOppilaitosResponse').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });
  });
});
