import { loggable } from 'cypress-pipe';
import { fireEvent } from '@testing-library/react';
import koodisto from '#/cypress/data/koodisto';

export const paste = loggable('paste', value => $element => {
  $element.focus();
  try {
    fireEvent.change($element[0], { target: { value } });
  } catch (e) {
    cy.wrap($element).then($destination => {
      const pasteEvent = Object.assign(
        new Event('paste', { bubbles: true, cancelable: true }),
        {
          clipboardData: {
            getData: (type = 'text') => value,
          },
        }
      );
      $destination[0].dispatchEvent(pasteEvent);
    });
  }
  return cy.wrap($element);
});

export const getByTestId = testId => cy.get(`[data-testid="${testId}"]`);

export const getRadio = value =>
  cy.get(`input[type="radio"][value="${value}"]`);

export const getSelectOption = value =>
  cy.get('[class*="option"]').contains(value);

export const getCheckbox = value =>
  cy.get(`input[type="checkbox"]${value ? `[name="${value}"]` : ''}`);

export const getSelect = () => cy.get('.Select__');

export const selectOption = value => {
  getSelect()
    .click()
    .within(() => {
      getSelectOption(value).click({ force: true });
    });
};

export const fillAsyncSelect = (input, match) => {
  getSelect().within(() => {
    cy.get('input[type="text"]').pipe(paste(input));
    cy.get(`div:contains(${match})`).first().click();
  });
};

export const stubKoodistoRoute = ({ koodisto: koodistonNimi }) => {
  cy.route({
    method: 'GET',
    url: `**/koodisto-service/rest/json/${koodistonNimi}/koodi**`,
    response: koodisto({ koodisto: koodistonNimi }),
  });
};

export const stubLokalisaatioRoute = () => {
  cy.route({
    method: 'GET',
    url: '**/lokalisointi/cxf/rest/v1/localisation**',
    response: [],
  });
};

export const typeToEditor = value => {
  cy.get('.Editor__').within(() => {
    cy.get('[contenteditable="true"]').pipe(paste(value));
  });
};

export const getTableInput = () => {
  return cy.get('.TableInput__');
};

export const fillDateTimeInput = ({ date, time }) => {
  getByTestId('DateTimeInput').within(() => {
    getByTestId('DateTimeInput__Date').find('input').clear().pipe(paste(date));
    getByTestId('DateTimeInput__Time').find('input').clear().pipe(paste(time));
  });
};

export const chooseKieliversiotLanguages = (selectedLanguages = []) => {
  const languages = ['en', 'fi', 'sv'];
  languages.forEach(lang => {
    cy.get(`input[name=${lang}]`).then($checkbox => {
      return selectedLanguages.includes(lang)
        ? cy.wrap($checkbox).check({ force: true })
        : cy.wrap($checkbox).uncheck({ force: true });
    });
  });
};

export const fillYhteyshenkilotFields = () => {
  getByTestId('lisaaYhteyshenkiloButton').click({ force: true });

  getByTestId('nimi').find('input').pipe(paste('nimi'));
  getByTestId('titteli').find('input').pipe(paste('titteli'));
  getByTestId('sahkoposti').find('input').pipe(paste('sähkoposti'));
  getByTestId('puhelinnumero').find('input').pipe(paste('puhelin'));
  getByTestId('verkkosivu').find('input').pipe(paste('verkkosivu'));
};

export const fillValintakoeFields = () => {
  selectOption('valintakokeentyyppi_1');

  getByTestId('lisaaTilaisuusButton').click({ force: true });

  getByTestId('osoite').find('input').pipe(paste('osoite'));

  getByTestId('postinumero').within(() => {
    fillAsyncSelect('0', '0 Posti_0');
  });

  getByTestId('alkaa').within(() => {
    fillDateTimeInput({
      date: '02.04.2019',
      time: '10:45',
    });
  });

  getByTestId('paattyy').within(() => {
    fillDateTimeInput({
      date: '02.04.2019',
      time: '19:00',
    });
  });

  getByTestId('lisatietoja').find('textarea').pipe(paste('lisatietoja'));
};

export const stubKayttoOikeusMeRoute = ({ user = {} } = {}) => {
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

export const stubKoutaBackendLoginRoute = () => {
  cy.route({
    method: 'GET',
    url: '**/kouta-backend/auth/login',
    response: {},
  });
};

export const stubKoutaBackendSessionRoute = () => {
  cy.route({
    method: 'GET',
    url: '**/kouta-backend/auth/session',
    response: {},
  });
};

export const stubHakemuspalveluLomakkeetRoute = ({
  lomakkeet = [{ name: { fi: 'Lomake 1' }, key: 'lomake_1' }],
} = {}) => {
  cy.route({
    method: 'GET',
    url: '**/lomake-editori/api/forms',
    response: {
      forms: lomakkeet,
    },
  });
};

export const stubOppijanumerorekisteriHenkiloRoute = ({
  henkilo = { etunimet: 'John', sukunimi: 'Doe' },
} = {}) => {
  cy.route({
    method: 'GET',
    url: '**/oppijanumerorekisteri-service/henkilo/**',
    response: henkilo,
  });
};

export const fillTreeSelect = value => {
  value.forEach(val => {
    cy.get(`input[type="checkbox"][name="${val}"]`).check({ force: true });
  });
};

export const fillKoulutustyyppiSelect = path => {
  path.forEach(option => {
    getRadio(option).check({ force: true });
  });
};

export const fillDatePickerInput = value => {
  cy.get('.DatePickerInput__').find('input').pipe(paste(value));
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
  stubLokalisaatioRoute();
  stubKayttoOikeusMeRoute();
  stubKoutaBackendLoginRoute();
  stubKoutaBackendSessionRoute();
};

export const jatka = () => getByTestId('jatkaButton').click({ force: true });

export const OPH_TEST_ORGANISAATIO_OID = '1.2.246.562.10.48587687889';

export const isStubbed =
  !process.env.CYPRESS_BACKEND || process.env.CYPRESS_BACKEND === 'stubs';
