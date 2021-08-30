import {
  fillJarjestyspaikkaSection,
  prepareTest,
} from '#/cypress/hakukohdeFormUtils';
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
  fillTilaSection,
  tallenna,
  fillAjankohtaFields,
  getSelectOption,
  wrapMutationTest,
} from '#/cypress/utils';
import { Alkamiskausityyppi, ENTITY } from '#/src/constants';

const lisaa = () => {
  getByTestId('lisaaButton').click({ force: true });
};

const fillPohjakoulutusvaatimusSection = () => {
  getByTestId('pohjakoulutusSection').within(() => {
    getByTestId('pohjakoulutusvaatimusSelect').within(() => {
      selectOption('Peruskoulu');
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

const fillLukiolinjaSection = () => {
  getByTestId('hakukohteenLinjaSection').within(() => {
    cy.findByText(/Yleislinja/).click();

    getByTestId('alinHyvaksytty')
      .find('input')
      .clear({ force: true })
      .pipe(paste('3,5'));

    typeToEditor('Lisätietoa');

    cy.findByLabelText(/hakukohdelomake\.painotetutArvosanat/).within(() => {
      cy.findByRole('button', {
        name: /hakukohdelomake\.lisaaPainotettavaOppiaine/,
      }).click();

      getByTestId('painotettuOppiaine-0').within(() => {
        selectOption('A1 englanti');
        getByTestId('painokerroin')
          .find('input')
          .clear({ force: true })
          .pipe(paste('1,5'));
      });

      cy.findByRole('button', {
        name: /hakukohdelomake\.lisaaPainotettavaOppiaine/,
      }).click();

      getByTestId('painotettuOppiaine-1').within(() => {
        selectOption('Musiikki');
        getByTestId('painokerroin')
          .find('input')
          .clear({ force: true })
          .pipe(paste('2'));
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

const fillLomakeSection = (type: string = 'ataru') => {
  getByTestId('lomakeSection').within(() => {
    getByTestId('eriHakulomake').within(() => {
      getCheckbox(null).click({ force: true });
    });
    if (type === 'ataru') {
      getRadio(type).click({ force: true });
      selectOption('Lomake 1');
    } else if (type === 'muu') {
      getRadio(type).click({ force: true });
      cy.get(`input[type="text"]`).click().pipe(paste('http://example.com'));
    } else if (type === 'ei sähköistä') {
      getRadio(type).click({ force: true });
      typeToEditor('hakulomake kuvaus');
    }
  });
};

const fillAlkamiskausiSection = () => {
  cy.findByText('hakukohdelomake.hakukohteellaEriAlkamiskausi').click();
  fillAjankohtaFields(Alkamiskausityyppi.HENKILOKOHTAINEN_SUUNNITELMA);
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
    cy.findByLabelText(/hakukohdelomake\.valitseValintaperustekuvaus/).click({
      force: true,
    });
    getSelectOption('Valintaperusteen nimi').click({ force: true });

    typeToEditor('Kynnysehto');

    jatka();
  });
};

const fillLiitteetSection = () => {
  getByTestId('liitteetSection').within(() => {
    lisaa();

    getByTestId('liitelista').within(() => {
      getByTestId('tyyppi').within(() => {
        selectOption('Lausunnot');
      });

      getByTestId('nimi').find('input').pipe(paste('Nimi'));

      getByTestId('kuvaus').within(() => {
        typeToEditor('Kuvaus');
      });

      fillDateTimeInput({
        date: '25.11.2019',
        time: '23:59',
      });

      getByTestId('toimitustapa').within(() => {
        getRadio('osoite').click({ force: true });
      });

      getByTestId('osoite').find('input').pipe(paste('Osoite'));

      getByTestId('postinumero').within(() => {
        fillAsyncSelect('00350');
      });

      getByTestId('sahkoposti')
        .find('input')
        .pipe(paste('sahkoposti@email.com'));
    });

    jatka();
  });
};

export const createHakukohdeForm = () => {
  const organisaatioOid = '1.2.246.562.10.52251087186'; // Stadin ammatti- ja aikuisopisto
  const hakuOid = '4.1.1.1.1.1';
  const hakukohdeOid = '1.2.3.4.5.6';

  const tarjoajat = [
    '1.2.246.562.10.45854578546', // Stadin ammatti- ja aikuisopisto, Myllypuron toimipaikka
  ];

  const mutationTest = wrapMutationTest({
    oid: hakukohdeOid,
    entity: ENTITY.HAKUKOHDE,
    stubGet: true,
  });

  it(
    'should be able to create ammatillinen hakukohde',
    mutationTest(() => {
      prepareTest({
        tyyppi: 'amm',
        hakuOid,
        hakukohdeOid,
        organisaatioOid,
        tarjoajat,
      });

      fillKieliversiotSection({ jatka: true });
      fillPohjakoulutusvaatimusSection();
      fillPerustiedotSection();
      fillAloituspaikatSection();
      fillValintaperusteenKuvausSection();
      fillValintakokeetSection({ withValintaperusteenKokeet: true });
      fillLiitteetSection();
      fillJarjestyspaikkaSection({
        jatka: true,
      });
      fillTilaSection();
      tallenna();

      cy.location('pathname').should(
        'eq',
        `/kouta/organisaatio/${organisaatioOid}/hakukohde/${hakukohdeOid}/muokkaus`
      );
    })
  );

  it(
    'should be able to create korkeakoulu hakukohde',
    mutationTest(() => {
      prepareTest({
        tyyppi: 'yo',
        hakuOid,
        hakukohdeOid,
        organisaatioOid,
        tarjoajat,
      });

      fillKieliversiotSection({ jatka: true });
      fillPohjakoulutusvaatimusSection();
      fillPerustiedotSection({ isKorkeakoulu: true });
      fillAloituspaikatSection({ isKorkeakoulu: true });
      fillValintaperusteenKuvausSection();
      fillValintakokeetSection({ withValintaperusteenKokeet: true });
      fillLiitteetSection();
      fillJarjestyspaikkaSection({ jatka: true });
      fillTilaSection();

      tallenna();

      cy.location('pathname').should(
        'eq',
        `/kouta/organisaatio/${organisaatioOid}/hakukohde/${hakukohdeOid}/muokkaus`
      );
    })
  );

  it(
    'should be able to create hakukohde with muu hakulomake',
    mutationTest(() => {
      prepareTest({
        tyyppi: 'yo',
        hakuOid,
        hakukohdeOid,
        organisaatioOid,
        tarjoajat,
      });

      fillKieliversiotSection({ jatka: true });
      fillPohjakoulutusvaatimusSection();
      fillLomakeSection('muu');

      tallenna();

      cy.location('pathname').should(
        'eq',
        `/kouta/organisaatio/${organisaatioOid}/hakukohde/${hakukohdeOid}/muokkaus`
      );
    })
  );

  it(
    'should be able to create hakukohde with "ei sähköistä" hakulomake',
    mutationTest(() => {
      prepareTest({
        tyyppi: 'yo',
        hakuOid,
        hakukohdeOid,
        organisaatioOid,
        tarjoajat,
      });

      fillKieliversiotSection({ jatka: true });
      fillPohjakoulutusvaatimusSection();
      fillLomakeSection('ei sähköistä');

      tallenna();

      cy.location('pathname').should(
        'eq',
        `/kouta/organisaatio/${organisaatioOid}/hakukohde/${hakukohdeOid}/muokkaus`
      );
    })
  );

  it(
    'should be able to create hakukohde with lukiolinjat',
    mutationTest(() => {
      prepareTest({
        tyyppi: 'lk',
        hakuOid,
        hakukohdeOid,
        organisaatioOid,
        tarjoajat,
      });

      fillKieliversiotSection({ jatka: true });
      fillPohjakoulutusvaatimusSection();
      fillLukiolinjaSection();

      tallenna();

      cy.location('pathname').should(
        'eq',
        `/kouta/organisaatio/${organisaatioOid}/hakukohde/${hakukohdeOid}/muokkaus`
      );
    })
  );
};
