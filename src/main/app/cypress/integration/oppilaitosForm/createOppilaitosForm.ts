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
  wrapMutationTest,
} from '#/cypress/utils';
import { ENTITY } from '#/src/constants';

const fillPerustiedotSection = () => {
  getByTestId('perustiedotSection').within(() => {
    getByTestId('opiskelijoita').find('input').pipe(paste('1'));
    getByTestId('korkeakouluja').find('input').pipe(paste('2'));
    getByTestId('tiedekuntia').find('input').pipe(paste('3'));
    getByTestId('kampuksia').find('input').pipe(paste('4'));
    getByTestId('yksikoita').find('input').pipe(paste('5'));
    getByTestId('toimipisteita').find('input').pipe(paste('6'));
    getByTestId('akatemioita').find('input').pipe(paste('7'));

    cy.findByLabelText(/oppilaitoslomake\.wwwSivu\b/).pipe(
      paste('www.verkkosivu.fi')
    );
    cy.findByLabelText(/oppilaitoslomake\.wwwSivuNimi/).pipe(
      paste('Verkkosivu fi')
    );

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

const checkYhteystiedotSection = () => {
  getByTestId('yhteystiedotSection').within(() => {
    cy.findByText(/oppilaitoslomake\.yhteystiedonNimi/)
      .parent()
      .next()
      .should('have.text', 'Organisaatio');

    cy.findByText(/yleiset\.postiosoite/)
      .parent()
      .next()
      .should('have.text', 'Horonpohjantie 279, 40101 Jyväskylä');

    cy.findByText(/yleiset\.kayntiosoite/)
      .parent()
      .next()
      .should('have.text', 'Verhonkulmala 220, 40720 Jyväskylä');

    cy.findByText(/yleiset\.sahkoposti/)
      .parent()
      .next()
      .should('have.text', 'hakija-31832505@oph.fi');

    cy.findByText(/yleiset\.puhelinnumero/)
      .parent()
      .next()
      .should('have.text', '050 28144921');

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

  const mutationTest = wrapMutationTest({
    oid: organisaatioOid,
    entity: ENTITY.OPPILAITOS,
  });

  it(
    'should be able to create oppilaitos without hakijapalveluyhteystiedot',
    mutationTest(() => {
      fillKieliversiotSection({ jatka: true });

      fillPerustiedotSection();

      fillEsittelySection();

      fillTeemakuvaSection();

      passOsatSection();

      fillTietoaOpiskelustaSection();

      fillTilaSection();

      checkYhteystiedotSection();

      skipHakijapalveluidenYhteystiedotSection();

      tallenna();
    })
  );

  it(
    'should be able to create oppilaitos with hakijapalveluyhteystiedot',
    mutationTest(() => {
      fillKieliversiotSection({ jatka: true });

      getByTestId('yhteystiedotSection').click();

      checkYhteystiedotSection();

      fillHakijapalveluidenYhteystiedotSection();

      tallenna();
    })
  );
};
