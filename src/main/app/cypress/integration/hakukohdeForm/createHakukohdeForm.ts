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
  getByTestId,
  paste,
  fillKieliversiotSection,
  fillTilaSection,
  tallenna,
  fillAjankohtaFields,
  getSelectOption,
  wrapMutationTest,
  getSelectByLabel,
  pFillAsyncSelect,
  withinSection,
  getInputByLabel,
  stubKayttoOikeusMeRoute,
  jatka,
} from '#/cypress/utils';
import { Alkamiskausityyppi, ENTITY } from '#/src/constants';

const lisaa = () => {
  getByTestId('lisaaButton').click({ force: true });
};

const fillPohjakoulutusvaatimusSection = () => {
  withinSection('pohjakoulutus', () => {
    getByTestId('pohjakoulutusvaatimusSelect').within(() => {
      selectOption('Peruskoulu');
    });

    typeToEditor('Tarkenne');
  });
};

const fillHakuajatSection = () => {
  withinSection('hakuajat', () => {
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
  withinSection('hakukohteenLinja', () => {
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

      getByTestId('painotettuOppiaine-0').within(() => {
        cy.findByRole('button', { name: /yleiset\.poistaRivi/ }).click();
      });

      cy.findAllByTestId(/^painotettuOppiaine-\d?$/).should('have.length', 1);
    });
    jatka();
  });
};

const fillPerustiedotSection = ({
  isLukio,
  isYhteishaku,
  fillKaksoistutkinto,
  hakukohdeKoodiNimi,
}: {
  isLukio?: boolean;
  isYhteishaku?: boolean;
  fillKaksoistutkinto?: boolean;
  hakukohdeKoodiNimi?: string;
} = {}) => {
  withinSection('perustiedot', () => {
    if (!isLukio) {
      if (hakukohdeKoodiNimi) {
        getSelectByLabel('yleiset.nimi').pipe(
          pFillAsyncSelect(hakukohdeKoodiNimi)
        );
      } else {
        getInputByLabel('yleiset.nimi')
          .clear({ force: true })
          .pipe(paste('Hakukohteen nimi'));
      }
    }

    if (fillKaksoistutkinto) {
      getByTestId('voiSuorittaaKaksoistutkinnon').within(() => {
        getCheckbox(null).click({ force: true });
      });
    }

    fillHakuajatSection();
    fillAlkamiskausiSection({
      isYhteishaku: isYhteishaku || Boolean(hakukohdeKoodiNimi),
    });
  });
  fillLomakeSection();
};

const skipPerustiedot = () => {
  getByTestId('perustiedotSection').within(() => {
    jatka();
  });
};

const fillLomakeSectionOnly = (type: string = 'ataru') => {
  fillLomakeSection(type);
  getByTestId('perustiedotSection').within(() => {
    jatka();
  });
};

const fillLomakeSection = (type: string = 'ataru') => {
  withinSection('perustiedot', () => {
    cy.findByTestId('lomakeSection').within(() => {
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
  });
};

const fillAlkamiskausiSection = (
  { isYhteishaku } = { isYhteishaku: false }
) => {
  if (isYhteishaku) {
    cy.findByLabelText('hakukohdelomake.hakukohteellaEriAlkamiskausi').should(
      'be.disabled'
    );
  } else {
    cy.findByText('hakukohdelomake.hakukohteellaEriAlkamiskausi').click();
    fillAjankohtaFields(Alkamiskausityyppi.HENKILOKOHTAINEN_SUUNNITELMA);
  }
};

const fillAloituspaikatSection = ({ isKorkeakoulu = false } = {}) => {
  withinSection('aloituspaikat', () => {
    getByTestId('aloituspaikkamaara').pipe(paste('10'));

    if (isKorkeakoulu) {
      getByTestId('ensikertalaismaara').pipe(paste('5'));
    }
  });
};

const fillValintaperusteenKuvausSection = () => {
  withinSection('valintaperusteenKuvaus', () => {
    cy.findByLabelText(/hakukohdelomake\.valitseValintaperustekuvaus/).click({
      force: true,
    });
    getSelectOption('Valintaperusteen nimi').click({ force: true });

    typeToEditor('Kynnysehto');
  });
};

const fillLiitteetSection = () => {
  withinSection('liitteet', () => {
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

      fillKieliversiotSection();
      fillPohjakoulutusvaatimusSection();
      fillPerustiedotSection({
        fillKaksoistutkinto: true,
        hakukohdeKoodiNimi: 'Kaivosalan perustutkinto',
      });
      fillAloituspaikatSection();
      fillValintaperusteenKuvausSection();
      fillValintakokeetSection({ withValintaperusteenKokeet: true });
      fillLiitteetSection();
      fillJarjestyspaikkaSection();
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
        hakutapaKoodiUri: 'hakutapa_02',
      });

      fillKieliversiotSection();
      fillPohjakoulutusvaatimusSection();
      fillPerustiedotSection();
      fillAloituspaikatSection({ isKorkeakoulu: true });
      fillValintaperusteenKuvausSection();
      fillValintakokeetSection({ withValintaperusteenKokeet: true });
      fillLiitteetSection();
      fillJarjestyspaikkaSection();
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

      fillKieliversiotSection();
      fillPohjakoulutusvaatimusSection();
      fillLomakeSectionOnly('muu');
      fillAloituspaikatSection({ isKorkeakoulu: false });

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
        hakutapaKoodiUri: 'hakutapa_02',
      });

      fillKieliversiotSection();
      fillPohjakoulutusvaatimusSection();
      fillLomakeSectionOnly('ei sähköistä');
      fillAloituspaikatSection({ isKorkeakoulu: true });

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

      fillKieliversiotSection();
      fillPerustiedotSection({ isLukio: true, isYhteishaku: true });
      fillPohjakoulutusvaatimusSection();
      fillLukiolinjaSection();
      skipPerustiedot();
      fillAloituspaikatSection({ isKorkeakoulu: false });

      tallenna();

      cy.location('pathname').should(
        'eq',
        `/kouta/organisaatio/${organisaatioOid}/hakukohde/${hakukohdeOid}/muokkaus`
      );
    })
  );
};

export const createHakukohdeFormAsOppilaitosUser = () => {
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

  beforeEach(() => {
    stubKayttoOikeusMeRoute({
      user: {
        roles: JSON.stringify(['APP_KOUTA']),
      },
    });
  });

  it('should not be possible to save hakukohde if haun liittämistakaraja has expired', () => {
    mutationTest(() => {
      prepareTest({
        tyyppi: 'lk',
        hakuOid,
        hakukohdeOid,
        organisaatioOid,
        tarjoajat,
        hakukohteenLiittaminenHasExpired: true,
      });

      fillKieliversiotSection({ jatka: true });

      cy.findByRole('button', {
        name: 'hakukohdelomake.muokkaamisenTakarajaYlittynyt',
      }).should('be.disabled');
    });
  });

  it('should not be possible to save hakukohde if haun muokkaamistakaraja has expired', () => {
    mutationTest(() => {
      prepareTest({
        tyyppi: 'lk',
        hakuOid,
        hakukohdeOid,
        organisaatioOid,
        tarjoajat,
        hakukohteenMuokkaaminenHasExpired: true,
      });

      fillKieliversiotSection({ jatka: true });

      cy.findByRole('button', {
        name: 'hakukohdelomake.muokkaamisenTakarajaYlittynyt',
      }).should('be.disabled');
    });
  });

  it("should be possible to save hakukohde if haun lisäämis- ja muokkaamistakarajat haven't been set", () => {
    mutationTest(() => {
      prepareTest({
        tyyppi: 'lk',
        hakuOid,
        hakukohdeOid,
        organisaatioOid,
        tarjoajat,
        hakuWithoutTakarajat: true,
      });

      fillKieliversiotSection({ jatka: true });

      cy.findByRole('button', {
        name: 'yleiset.tallenna',
      }).should('not.be.disabled');
    });
  });

  it('should be possible to save hakukohde if haun lisäämistakaraja has expired but muokkaamistakaraja has not been set', () => {
    mutationTest(() => {
      prepareTest({
        tyyppi: 'lk',
        hakuOid,
        hakukohdeOid,
        organisaatioOid,
        tarjoajat,
        hakukohteenLiittaminenHasExpired: true,
        hakuWithoutMuokkaamisenTakaraja: true,
      });

      fillKieliversiotSection({ jatka: true });

      cy.findByRole('button', {
        name: 'yleiset.tallenna',
      }).should('not.be.disabled');
    });
  });
};
