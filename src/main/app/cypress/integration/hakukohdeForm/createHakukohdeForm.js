import {
  getRadio,
  selectOption,
  getCheckbox,
  fillDateTimeInput,
  chooseKieliversiotLanguages,
  fillValintakoeFields,
  fillAsyncSelect,
  typeToEditor,
  jatka,
} from '#/cypress/utils';

import { prepareTest } from '#/cypress/hakukohdeFormUtils';

const lisaa = () => {
  cy.getByTestId('lisaaButton').click({ force: true });
};

const tallenna = () => {
  cy.getByTestId('tallennaHakukohdeButton').click({ force: true });
};

const fillKieliversiotSection = () => {
  cy.getByTestId('kieliversiotSection').within(() => {
    chooseKieliversiotLanguages(['fi'], cy);
    jatka();
  });
};

const fillPohjakoulutusvaatimusSection = () => {
  cy.getByTestId('pohjakoulutusSection').within(() => {
    cy.getByTestId('pohjakoulutusvaatimusSelect').within(() => {
      selectOption('pohjakoulutusvaatimustoinenaste_0', cy);
    });

    typeToEditor('Tarkenne', cy);

    jatka();
  });
};

const fillDatetime = ({ date, time }) => {
  fillDateTimeInput({ date, time, cy });
};

const fillHakuajatSection = () => {
  cy.getByTestId('hakuajatSection').within(() => {
    getCheckbox(null, cy).click({ force: true });
    lisaa();

    cy.getByTestId('alkaa').within(() => {
      fillDatetime({
        date: '02.04.2019',
        time: '10:45',
      });
    });

    cy.getByTestId('paattyy').within(() => {
      fillDatetime({
        date: '25.11.2019',
        time: '23:59',
      });
    });
  });
};

const fillPerustiedotSection = ({ isKorkeakoulu = false } = {}) => {
  cy.getByTestId('perustiedotSection').within(() => {
    cy.getByTestId('hakukohteenNimi')
      .find('input')
      .clear({ force: true })
      .paste('Hakukohteen nimi');

    if (!isKorkeakoulu) {
      cy.getByTestId('voiSuorittaaKaksoistutkinnon').within(() => {
        getCheckbox(null, cy).click({ force: true });
      });
    }

    fillHakuajatSection();
    fillAlkamiskausiSection();
    fillLomakeSection();

    jatka();
  });
};

const fillLomakeSection = () => {
  cy.getByTestId('lomakeSection').within(() => {
    cy.getByTestId('eriHakulomake').within(() => {
      getCheckbox(null, cy).click({ force: true });
    });

    getRadio('ataru', cy).click({ force: true });
    selectOption('Lomake 1', cy);
  });
};

const fillAlkamiskausiSection = () => {
  cy.getByTestId('alkamiskausiSection').within(() => {
    cy.getByTestId('eriAlkamiskausi').within(() => {
      getCheckbox(null, cy).click({ force: true });
    });

    getRadio('kausi_0#1', cy).click({ force: true });
    selectOption(new Date().getFullYear().toString(), cy);
  });
};

const fillAloituspaikatSection = ({ isKorkeakoulu = false } = {}) => {
  cy.getByTestId('aloituspaikatSection').within(() => {
    cy.getByTestId('aloituspaikkamaara').paste('10');

    if (isKorkeakoulu) {
      cy.getByTestId('ensikertalaismaara').paste('5');
    }

    jatka();
  });
};

const fillValintaperusteenKuvausSection = () => {
  cy.getByTestId('valintaperusteenKuvausSection').within(() => {
    selectOption('Valintaperusteen nimi', cy);
    jatka();
  });
};

const fillValintakoeSection = () => {
  cy.getByTestId('valintakoeSection').within(() => {
    fillValintakoeFields();
    jatka();
  });
};

const fillLiitteetSection = () => {
  cy.getByTestId('liitteetSection').within(() => {
    lisaa();

    cy.getByTestId('liitelista').within(() => {
      cy.getByTestId('tyyppi').within(() => {
        selectOption('liitetyypitamm_0', cy);
      });

      cy.getByTestId('nimi').find('input').paste('Nimi');

      cy.getByTestId('kuvaus').find('textarea').paste('Kuvaus');

      fillDatetime({
        date: '25.11.2019',
        time: '23:59',
      });

      cy.getByTestId('toimitustapa').within(() => {
        getRadio('osoite', cy).click({ force: true });
      });

      cy.getByTestId('osoite').find('input').paste('Osoite');

      cy.getByTestId('postinumero').within(() => {
        fillAsyncSelect('0', 'Posti_0');
      });

      cy.getByTestId('sahkoposti').find('input').paste('sahkoposti@email.com');
    });

    jatka();
  });
};

const fillTilaSection = (tila = 'julkaistu') => {
  cy.getByTestId('tilaSection').within(() => {
    getRadio(tila, cy).check({ force: true });
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

    fillKieliversiotSection();
    fillPohjakoulutusvaatimusSection();
    fillPerustiedotSection();
    fillAloituspaikatSection();
    fillValintaperusteenKuvausSection();
    fillValintakoeSection();
    fillLiitteetSection();
    fillTilaSection();
    tallenna();

    cy.wait('@createHakukohdeRequest').then(({ request }) => {
      cy.wrap(request.body).snapshot();
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

    fillKieliversiotSection();
    fillPohjakoulutusvaatimusSection();
    fillPerustiedotSection({ isKorkeakoulu: true });
    fillAloituspaikatSection({ isKorkeakoulu: true });
    fillValintaperusteenKuvausSection();
    fillValintakoeSection();
    fillLiitteetSection();
    fillTilaSection();

    tallenna();

    cy.wait('@createHakukohdeRequest').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });

    cy.location('pathname').should(
      'eq',
      `/kouta/organisaatio/${organisaatioOid}/hakukohde/${hakukohdeOid}/muokkaus`
    );
  });
});
