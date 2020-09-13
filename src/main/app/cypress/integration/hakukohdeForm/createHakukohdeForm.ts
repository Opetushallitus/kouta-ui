import {
  getRadio,
  selectOption,
  getCheckbox,
  fillDateTimeInput,
  fillValintakokeetSection,
  fillAsyncSelect,
  typeToEditor,
  jatka,
  getByTestId,
  paste,
  fillKieliversiotSection,
} from '#/cypress/utils';

import { prepareTest } from '#/cypress/hakukohdeFormUtils';

const lisaa = () => {
  getByTestId('lisaaButton').click({ force: true });
};

const tallenna = () => {
  getByTestId('tallennaHakukohdeButton').click();
};

const fillPohjakoulutusvaatimusSection = () => {
  getByTestId('pohjakoulutusSection').within(() => {
    getByTestId('pohjakoulutusvaatimusSelect').within(() => {
      selectOption('pohjakoulutusvaatimustoinenaste_0');
    });

    typeToEditor('Tarkenne');

    jatka();
  });
};

const fillHakuajatSection = () => {
  getByTestId('hakuajatSection').within(() => {
    getCheckbox(null).click({ force: true });
    lisaa();

    getByTestId('alkaa').within(() => {
      fillDateTimeInput({
        date: '02.04.2019',
        time: '10:45',
      });
    });

    getByTestId('paattyy').within(() => {
      fillDateTimeInput({
        date: '25.11.2019',
        time: '23:59',
      });
    });
  });
};

const fillPerustiedotSection = ({ isKorkeakoulu = false } = {}) => {
  getByTestId('perustiedotSection').within(() => {
    getByTestId('hakukohteenNimi')
      .find('input')
      .clear({ force: true })
      .pipe(paste('Hakukohteen nimi'));

    if (!isKorkeakoulu) {
      getByTestId('voiSuorittaaKaksoistutkinnon').within(() => {
        getCheckbox(null).click({ force: true });
      });
    }

    fillHakuajatSection();
    fillAlkamiskausiSection();
    fillLomakeSection();

    jatka();
  });
};

const fillLomakeSection = () => {
  getByTestId('lomakeSection').within(() => {
    getByTestId('eriHakulomake').within(() => {
      getCheckbox(null).click({ force: true });
    });

    getRadio('ataru').click({ force: true });
    selectOption('Lomake 1');
  });
};

const fillAlkamiskausiSection = () => {
  getByTestId('alkamiskausiSection').within(() => {
    getByTestId('eriAlkamiskausi').within(() => {
      getCheckbox(null).click({ force: true });
    });

    getRadio('kausi_0#1').click({ force: true });
    selectOption(new Date().getFullYear().toString());
  });
};

const fillAloituspaikatSection = ({ isKorkeakoulu = false } = {}) => {
  getByTestId('aloituspaikatSection').within(() => {
    getByTestId('aloituspaikkamaara').pipe(paste('10'));

    if (isKorkeakoulu) {
      getByTestId('ensikertalaismaara').pipe(paste('5'));
    }

    jatka();
  });
};

const fillValintaperusteenKuvausSection = () => {
  getByTestId('valintaperusteenKuvausSection').within(() => {
    selectOption('Valintaperusteen nimi');
    jatka();
  });
};

const fillLiitteetSection = () => {
  getByTestId('liitteetSection').within(() => {
    lisaa();

    getByTestId('liitelista').within(() => {
      getByTestId('tyyppi').within(() => {
        selectOption('liitetyypitamm_0');
      });

      getByTestId('nimi').find('input').pipe(paste('Nimi'));

      getByTestId('kuvaus').find('textarea').pipe(paste('Kuvaus'));

      fillDateTimeInput({
        date: '25.11.2019',
        time: '23:59',
      });

      getByTestId('toimitustapa').within(() => {
        getRadio('osoite').click({ force: true });
      });

      getByTestId('osoite').find('input').pipe(paste('Osoite'));

      getByTestId('postinumero').within(() => {
        fillAsyncSelect('0', 'Posti_0');
      });

      getByTestId('sahkoposti')
        .find('input')
        .pipe(paste('sahkoposti@email.com'));
    });

    jatka();
  });
};

const fillTilaSection = (tila = 'julkaistu') => {
  getByTestId('tilaSection').within(() => {
    getRadio(tila).check({ force: true });
  });
};

describe('createHakukohdeForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const hakuOid = '4.1.1.1.1.1';
  const hakukohdeOid = '1.2.3.4.5.6';
  it('should be able to create ammatillinen hakukohde', () => {
    prepareTest({
      tyyppi: 'amm',
      hakuOid,
      hakukohdeOid,
      organisaatioOid,
    });

    fillKieliversiotSection({ jatka: true });
    fillPohjakoulutusvaatimusSection();
    fillPerustiedotSection();
    fillAloituspaikatSection();
    fillValintaperusteenKuvausSection();
    fillValintakokeetSection();
    fillLiitteetSection();
    fillTilaSection();
    tallenna();

    cy.wait('@createHakukohdeRequest').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });

    cy.location('pathname').should(
      'eq',
      `/kouta/organisaatio/${organisaatioOid}/hakukohde/${hakukohdeOid}/muokkaus`
    );
  });

  it('should be able to create korkeakoulu hakukohde', () => {
    prepareTest({
      tyyppi: 'yo',
      hakuOid,
      hakukohdeOid,
      organisaatioOid,
    });

    fillKieliversiotSection({ jatka: true });
    fillPohjakoulutusvaatimusSection();
    fillPerustiedotSection({ isKorkeakoulu: true });
    fillAloituspaikatSection({ isKorkeakoulu: true });
    fillValintaperusteenKuvausSection();
    fillValintakokeetSection();
    fillLiitteetSection();
    fillTilaSection();

    tallenna();

    cy.wait('@createHakukohdeRequest').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });

    cy.location('pathname').should(
      'eq',
      `/kouta/organisaatio/${organisaatioOid}/hakukohde/${hakukohdeOid}/muokkaus`
    );
  });
});
