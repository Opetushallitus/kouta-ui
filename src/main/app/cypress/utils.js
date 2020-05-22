import koodisto from '#/cypress/data/koodisto';

export const getByTestId = (testId, cy) => {
  return cy.get(`[data-testid="${testId}"]`);
};

export const getRadio = (value, cy) => {
  return cy.get(`input[type="radio"][value="${value}"]`);
};

export const getSelectOption = (value, cy) => {
  return cy.get('[class*="option"]').contains(value);
};

export const getCheckbox = (value, cy) => {
  return cy.get(`input[type="checkbox"]${value ? `[name="${value}"]` : ''}`);
};

export const getSelect = cy => {
  return cy.get('.Select__');
};

export const selectOption = (value, cy) => {
  getSelect(cy).click();

  getSelect(cy).within(() => {
    getSelectOption(value, cy).click({ force: true });
  });
};

export const fillAsyncSelect = (input, match) => {
  getSelect(cy).find('input[type="text"]').paste(input);

  getSelect(cy).within(() => {
    cy.get(`div:contains(${match})`).first().click();
  });
};

export const stubKoodistoRoute = ({ koodisto: koodistonNimi, cy }) => {
  cy.route({
    method: 'GET',
    url: `**/koodisto-service/rest/json/${koodistonNimi}/koodi**`,
    response: koodisto({ koodisto: koodistonNimi }),
  });
};

export const stubLokalisaatioRoute = ({ cy }) => {
  cy.route({
    method: 'GET',
    url: '**/lokalisointi/cxf/rest/v1/localisation**',
    response: [],
  });
};

export const typeToEditor = (value, cy) => {
  cy.get('.Editor__').within(() => {
    cy.get('[contenteditable="true"]').paste(value);
  });
};

export const getTableInput = cy => {
  return cy.get('.TableInput__');
};

export const fillDateTimeInput = ({ date, time, cy }) => {
  getByTestId('DateTimeInput', cy).within(() => {
    getByTestId('DateTimeInput__Date', cy).find('input').paste(date);
    getByTestId('DateTimeInput__Time', cy).find('input').clear().paste(time);
  });
};

export const chooseKieliversiotLanguages = (selectedLanguages, cy) => {
  const languages = ['en', 'fi', 'sv'];
  languages.forEach(lang => {
    cy.get(`input[name=${lang}]`).as('checkbox');

    if (selectedLanguages.includes(lang)) {
      cy.get('@checkbox').check({ force: true });
    } else {
      cy.get('@checkbox').uncheck({ force: true });
    }
  });
};

export const fillYhteyshenkilotFields = ({ cy }) => {
  cy.getByTestId('lisaaYhteyshenkiloButton').click({ force: true });

  cy.getByTestId('nimi').find('input').paste('nimi');
  cy.getByTestId('titteli').find('input').paste('titteli');
  cy.getByTestId('sahkoposti').find('input').paste('sähkoposti');
  cy.getByTestId('puhelinnumero').find('input').paste('puhelin');
  cy.getByTestId('verkkosivu').find('input').paste('verkkosivu');
};

export const fillValintakoeFields = () => {
  selectOption('valintakokeentyyppi_1', cy);

  cy.getByTestId('lisaaTilaisuusButton').click({ force: true });

  cy.getByTestId('osoite').find('input').paste('osoite');

  cy.getByTestId('postinumero').within(() => {
    fillAsyncSelect('0', '0 Posti_0');
  });

  cy.getByTestId('alkaa').within(() => {
    fillDateTimeInput({
      date: '02.04.2019',
      time: '10:45',
      cy,
    });
  });

  cy.getByTestId('paattyy').within(() => {
    fillDateTimeInput({
      date: '02.04.2019',
      time: '19:00',
      cy,
    });
  });

  cy.getByTestId('lisatietoja').find('textarea').paste('lisatietoja');
};

export const stubKayttoOikeusMeRoute = ({ user = {}, cy }) => {
  cy.route({
    method: 'GET',
    url: '**/kayttooikeus-service/cas/me',
    response: {
      uid: 'johndoe',
      oid: '1.2.246.562.24.62301161440',
      firstName: 'John',
      lastName: 'Doe',
      lang: 'fi',
      roles: JSON.stringify([
        'APP_KOUTA_OPHPAAKAYTTAJA_1.2.246.562.10.00000000001',
      ]),
      ...user,
    },
  });
};

export const stubKoutaBackendLoginRoute = ({ cy }) => {
  cy.route({
    method: 'GET',
    url: '**/kouta-backend/auth/login',
    response: {},
  });
};

export const stubKoutaBackendSessionRoute = ({ cy }) => {
  cy.route({
    method: 'GET',
    url: '**/kouta-backend/auth/session',
    response: {},
  });
};

export const stubHakemuspalveluLomakkeetRoute = ({
  cy,
  lomakkeet = [{ name: { fi: 'Lomake 1' }, key: 'lomake_1' }],
}) => {
  cy.route({
    method: 'GET',
    url: '**/lomake-editori/api/forms',
    response: {
      forms: lomakkeet,
    },
  });
};

export const stubOppijanumerorekisteriHenkiloRoute = ({
  cy,
  henkilo = { etunimet: 'John', sukunimi: 'Doe' },
}) => {
  cy.route({
    method: 'GET',
    url: '**/oppijanumerorekisteri-service/henkilo/**',
    response: henkilo,
  });
};

export const fillTreeSelect = (value, cy) => {
  value.forEach(val => {
    cy.get(`input[type="checkbox"][name="${val}"]`).check({ force: true });
  });
};

export const fillKoulutustyyppiSelect = (path, cy) => {
  path.forEach(option => {
    getRadio(option, cy).check({ force: true });
  });
};

export const fillDatePickerInput = value => {
  cy.get('.DatePickerInput__').find('input').paste(value);
};

export const stubKoodiRoute = koodi => {
  const { koodiUri, versio } = koodi;

  return cy.route({
    method: 'GET',
    url: `/koodisto-service/rest/codeelement/${koodiUri}/${versio}`,
    response: koodi,
  });
};

export const stubEPerusteetByKoulutuskoodiRoute = () => {
  cy.route({
    method: 'GET',
    url:
      '**/eperusteet-service/api/perusteet?tuleva=true&siirtyma=false&voimassaolo=true&poistunut=false&kieli=fi&koulutuskoodi=koulutus_0',
    response: {
      data: [
        {
          nimi: { fi: 'koulutus_0' },
          kuvaus: { fi: 'koulutus_0 kuvaus' },
          osaamisalat: [
            { uri: 'osaamisala_0', nimi: { fi: 'osaamisala_0 nimi' } },
          ],
          tutkintonimikeKoodiUri: 'nimike_1#1',
          id: 1,
        },
      ],
    },
  });
};

export const stubCommonRoutes = () => {
  stubLokalisaatioRoute({ cy });
  stubKayttoOikeusMeRoute({ cy });
  stubKoutaBackendLoginRoute({ cy });
  stubKoutaBackendSessionRoute({ cy });
};

export const jatka = () => cy.getByTestId('jatkaButton').click({ force: true });

export const OPH_TEST_ORGANISAATIO_OID = '1.2.246.562.10.48587687889';

export const isStubbed =
  !process.env.CYPRESS_BACKEND || process.env.CYPRESS_BACKEND === 'stubs';
