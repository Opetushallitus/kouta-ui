import koodisto from './data/koodisto';

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
  getSelect(cy)
    .find('input[type="text"]')
    .type(input, { force: true });

  getSelect(cy).within(() => {
    cy.get(`div:contains(${match})`)
      .first()
      .click();
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
    cy.get('[contenteditable="true"]').type(value, { force: true });
  });
};

export const getTableInput = cy => {
  return cy.get('.TableInput__');
};

export const fillDateTimeInput = ({ date, time, cy }) => {
  getByTestId('DateTimeInput', cy).within(() => {
    getByTestId('DateTimeInput__Date', cy)
      .find('input')
      .type(date, { force: true });
    getByTestId('DateTimeInput__Time', cy)
      .find('input')
      .clear()
      .type(time, { force: true });
  });
};

export const chooseKieliversiotLanguages = (languages, cy) => {
  cy.get('input[name=sv]').uncheck({ force: true });
  cy.get('input[name=fi]').uncheck({ force: true });
  cy.get('input[name=en]').uncheck({ force: true });

  languages.forEach(language => {
    cy.get(`input[name=${language}]`).check({ force: true });
  });
};

export const fillYhteyshenkilotFields = ({ cy }) => {
  cy.getByTestId('lisaaYhteyshenkiloButton').click({ force: true });

  cy.getByTestId('nimi')
    .find('input')
    .type('nimi', { force: true });
  cy.getByTestId('titteli')
    .find('input')
    .type('titteli', { force: true });
  cy.getByTestId('sahkoposti')
    .find('input')
    .type('sähkoposti', { force: true });
  cy.getByTestId('puhelinnumero')
    .find('input')
    .type('puhelin', { force: true });
  cy.getByTestId('verkkosivu')
    .find('input')
    .type('verkkosivu', { force: true });
};

export const fillValintakoeFields = () => {
  selectOption('valintakokeentyyppi_1', cy);

  cy.getByTestId('lisaaTilaisuusButton').click({ force: true });

  cy.getByTestId('osoite')
    .find('input')
    .type('osoite', { force: true });

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

  cy.getByTestId('lisatietoja')
    .find('textarea')
    .type('lisatietoja', { force: true });
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
  cy.get('.DatePickerInput__')
    .find('input')
    .type(value, { force: true });
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
