import { fireEvent } from '@testing-library/react';
import { loggable } from 'cypress-pipe';
import { playMocks } from 'kto-ui-common/cypress/mockUtils';
import { isEmpty, includes, last, merge, toLower, uniqueId } from 'lodash/fp';

import commonMocks from '#/cypress/mocks/common.mocks.json';
import { Alkamiskausityyppi } from '#/src/constants';

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

export const getSelectOption = value =>
  cy.findAllByRole('option').contains(value);

export const pFillSelect = loggable(
  'fillSelect',
  value => $element =>
    cy
      .wrap($element)
      .click()
      .within(() => {
        getSelectOption(value).click({ force: true });
      })
);

export const pFillAsyncSelect = loggable(
  'fillAsyncSelect',
  (input, match = null) =>
    $element =>
      cy.wrap($element).within(() => {
        cy.get('input[type="text"]')
          .should('not.be.disabled')
          .pipe(paste(input));
        cy.findAllByRole('option', { name: includes(match || input) })
          .first()
          .click({ force: true });
      })
);

export const pFillEditor = loggable(
  'fillEditor',
  value => $element =>
    cy.wrap($element).within(() => {
      // NOTE: .clear wont work here -> use type instead
      cy.get('[contenteditable="true"]').type('{selectall}').pipe(paste(value));
    })
);

export const getInputByLabel = text =>
  cy.findByLabelText(text, { exact: false });

export const getSelectByLabel = text =>
  getInputByLabel(text).closest('.Select__');

export const getEditorByLabel = text =>
  getInputByLabel(text).closest('.Editor__');

export const getByTestId = cy.findByTestId;

export const getFieldWrapperByName = name =>
  cy.findByTestId(`form-control_${name}`);

export const getRadio = value =>
  cy.get(`input[type="radio"][value="${value}"]`);

export const getCheckbox = value =>
  cy.get(`input[type="checkbox"]${value ? `[name="${value}"]` : ''}`);

export const selectCheckbox = name =>
  cy.findByRole('checkbox', { name }).check({ force: true });

export const getSelect = () => cy.get('.Select__');

export const selectOption = value => getSelect().pipe(pFillSelect(value));

export const fillAsyncSelect = (input, match = null) => {
  getSelect().pipe(pFillAsyncSelect(input, match));
};

export const withinSection = (name, fn) =>
  cy.findByTestId(`${name}Section`).within($sectionEl => {
    const sectionIsOpen = !isEmpty($sectionEl.children('[open]'));

    if (!sectionIsOpen) {
      cy.wrap($sectionEl).click();
    }

    cy.wrap($sectionEl).within(() => {
      fn();
    });
  });

export const stubLokalisaatioRoute = () => {
  cy.intercept(
    { method: 'GET', url: '/lokalisointi/cxf/rest/v1/localisation' },
    { body: [] }
  );
};

export const typeToEditor = value =>
  cy.get('.Editor__').pipe(pFillEditor(value));

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
    cy.get(`input[name=${lang}]`)
      .should('not.be.disabled')
      .then($checkbox => {
        return selectedLanguages.includes(lang)
          ? cy.wrap($checkbox).check({ force: true })
          : cy.wrap($checkbox).uncheck({ force: true });
      });
  });
};

export const fillYhteyshenkilotFields = () => {
  cy.findByRole('button', { name: 'yleiset.lisaaYhteyshenkilo' }).click({
    force: true,
  });
  cy.findByRole('textbox', { name: 'yleiset.nimi' }).pipe(paste('nimi'));
  cy.findByRole('textbox', { name: 'yleiset.titteli' }).pipe(paste('titteli'));
  cy.findByRole('textbox', { name: 'yleiset.sahkoposti' }).pipe(
    paste('sähköposti')
  );

  cy.findByRole('textbox', { name: 'yleiset.puhelinnumero' }).pipe(
    paste('puhelin')
  );
  cy.findByRole('textbox', { name: 'yleiset.verkkosivu' }).pipe(
    paste('verkkosivu')
  );
};

export const stubKayttoOikeusMeRoute = ({ user = {} } = {}) => {
  cy.intercept(
    { method: 'GET', url: '/kayttooikeus-service/cas/me' },
    {
      body: {
        uid: 'johndoe',
        oid: '1.2.246.562.24.62301161440',
        firstName: 'John',
        lastName: 'Doe',
        lang: 'fi',
        roles: JSON.stringify([
          'APP_KOUTA',
          'APP_KOUTA_OPHPAAKAYTTAJA',
          'APP_KOUTA_OPHPAAKAYTTAJA_1.2.246.562.10.00000000001',
        ]),
        ...user,
      },
    }
  );
};

export const stubAsiointikieliRoute = () => {
  cy.intercept(
    {
      method: 'GET',
      url: '/oppijanumerorekisteri-service/henkilo/current/asiointiKieli',
    },
    {
      body: 'fi',
    }
  );
};

export const stubKoutaBackendLoginRoute = () => {
  cy.intercept(
    { method: 'GET', url: '/kouta-backend/auth/login' },
    { statusCode: 200, body: {} }
  );
};

export const stubKoutaBackendSessionRoute = () => {
  cy.intercept(
    { method: 'GET', url: '/kouta-backend/auth/session' },
    { statusCode: 200, body: {} }
  );
};

export const stubHakemuspalveluLomakkeetRoute = ({
  lomakkeet = [{ name: { fi: 'Lomake 1' }, key: 'lomake_1' }],
} = {}) => {
  cy.intercept(
    { method: 'GET', url: '/lomake-editori/api/forms' },
    {
      body: {
        forms: lomakkeet,
      },
    }
  );
};

export const stubOppijanumerorekisteriHenkiloRoute = ({
  henkilo = { etunimet: 'John', sukunimi: 'Doe' },
} = {}) => {
  cy.intercept(
    { method: 'GET', url: '/oppijanumerorekisteri-service/henkilo/' },
    { body: henkilo }
  );
};

export const fillTreeSelect = value => {
  value.forEach(val => {
    cy.get(`input[type="checkbox"][name="${val}"]`).check({ force: true });
  });
};

export const fillDatePickerInput = value => {
  cy.get('.DatePickerInput__').find('input').pipe(paste(value));
};

const koutaSearchItem = ({ idProp = 'oid' } = { idProp: 'oid' }) => ({
  modified: '2019-02-20T07:55',
  muokkaaja: { nimi: 'John Doe', oid: '1.2.246.562.24.62301161440' },
  nimi: { fi: 'Nimi' },
  [idProp]: '1.1.1.1.1.1',
  organisaatio: {},
  tila: 'tallennettu',
});

const stubEntityLists = () => {
  cy.intercept(
    { method: 'GET', url: '/kouta-backend/search/koulutukset?*' },
    {
      body: {
        result: [
          merge(koutaSearchItem(), { nimi: { fi: 'Koulutuksen nimi' } }),
        ],
        totalCount: 1,
      },
    }
  );

  cy.intercept(
    { method: 'GET', url: '/kouta-backend/search/toteutukset?*' },
    {
      body: {
        result: [
          merge(koutaSearchItem(), { nimi: { fi: 'Toteutuksen nimi' } }),
        ],
        totalCount: 1,
      },
    }
  );

  cy.intercept(
    { method: 'GET', url: '/kouta-backend/search/haut?*' },
    {
      body: {
        result: [merge(koutaSearchItem(), { nimi: { fi: 'Haun nimi' } })],
        totalCount: 1,
      },
    }
  );

  cy.intercept(
    { method: 'GET', url: '/kouta-backend/search/valintaperusteet?*' },
    {
      body: {
        result: [
          merge(koutaSearchItem({ idProp: 'id' }), {
            nimi: { fi: 'Valintaperusteen nimi' },
          }),
        ],
        totalCount: 1,
      },
    }
  );

  cy.intercept(
    { method: 'GET', url: '/kouta-backend/search/hakukohteet?*' },
    {
      body: {
        result: [
          merge(koutaSearchItem(), { nimi: { fi: 'Hakukohteen nimi' } }),
        ],
        totalCount: 1,
      },
    }
  );
};

export const stubCommonRoutes = () => {
  stubEntityLists();
  stubLokalisaatioRoute();
  stubKayttoOikeusMeRoute();
  stubAsiointikieliRoute();
  stubKoutaBackendLoginRoute();
  stubKoutaBackendSessionRoute();
  playMocks(commonMocks);
};

export const jatka = () =>
  cy.findByRole('button', { name: 'yleiset.jatka' }).click();

export const OPH_TEST_ORGANISAATIO_OID = '1.2.246.562.10.48587687889';

export const isStubbed =
  !process.env.CYPRESS_BACKEND || process.env.CYPRESS_BACKEND === 'stubs';

const fillTilaisuus = () => {
  getByTestId('lisaaTilaisuusButton').click({ force: true });
  getByTestId('osoite').find('input').pipe(paste('osoite'));
  getByTestId('postinumero').within(() => {
    fillAsyncSelect('00350');
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

  getByTestId('jarjestamispaikka').find('input').pipe(paste('paikka'));
  getByTestId('lisatietoja').within(() => {
    typeToEditor('lisatietoja');
  });
};

export const fillValintakokeetSection = ({
  withValintaperusteenKokeet = false,
} = {}) => {
  withinSection('valintakokeet', () => {
    getByTestId('yleisKuvaus').within(() => {
      typeToEditor('Valintakokeiden kuvaus');
    });

    if (withValintaperusteenKokeet) {
      getByTestId('valintaperusteenValintakokeet').within(() => {
        fillTilaisuus();
      });
    }

    getByTestId('kokeetTaiLisanaytot').within(() => {
      getByTestId('lisaaKoeTaiLisanayttoButton').click({ force: true });
      getByTestId('kokeenTaiLisanaytonTyyppi').within(() => {
        selectOption('Valintakoe');
      });
      getByTestId('hakijalleNakyvaNimi').find('input').pipe(paste('nimi'));

      getByTestId('tietoaHakijalle').within(() => {
        typeToEditor('Tietoa hakijalle');
      });

      getByTestId('vahimmaispistemaara').find('input').pipe(paste('10,03'));

      getByTestId('liittyyEnnakkovalmistautumista').within(() => {
        getCheckbox(null).check({ force: true });
      });

      getByTestId('ohjeetEnnakkovalmistautumiseen').within(() => {
        typeToEditor('ohjeet ennakkovalmistautumiseen');
      });

      getByTestId('erityisjarjestelytMahdollisia').within(() => {
        getCheckbox(null).check({ force: true });
      });

      getByTestId('ohjeetErityisjarjestelyihin').within(() => {
        typeToEditor('ohjeet erityisjärjestelyihin');
      });

      fillTilaisuus();
    });
    jatka();
  });
};

export const fillKieliversiotSection = (
  { jatka: pressJatka } = {
    jatka: false,
  }
) => {
  withinSection('kieliversiot', () => {
    chooseKieliversiotLanguages(['fi']);
    if (pressJatka) {
      jatka();
    }
  });
};

export const fillPohjaSection = () => {
  withinSection('pohja', () => {
    jatka();
  });
};

export const fillTilaSection = (tila = 'julkaistu') => {
  withinSection('tila', () => {
    getRadio(tila).check({ force: true });
  });
};

export const tallenna = () => {
  cy.findByRole('button', { name: 'yleiset.tallenna' }).click();
};

const isTutkintoonJohtava = koulutustyyppi =>
  ['amk', 'yo', 'amm', 'lk'].includes(koulutustyyppi);

export const fillKoulutustyyppiSelect = koulutustyyppiPath => {
  const johtaaTutkintoon = isTutkintoonJohtava(last(koulutustyyppiPath));

  if (johtaaTutkintoon) {
    cy.findByRole('button', {
      name: 'koulutustyyppivalikko.tutkintoonJohtavatKoulutustyypit',
    }).click();
  } else {
    cy.findByRole('button', {
      name: 'koulutustyyppivalikko.muutKoulutustyypit',
    }).click();
  }

  koulutustyyppiPath.forEach(option => {
    getRadio(option).check({ force: true });
  });
};

export const fillKoulutustyyppiSection = koulutustyyppiPath => {
  withinSection('koulutustyyppi', () => {
    fillKoulutustyyppiSelect(koulutustyyppiPath);
    jatka();
  });
};

export const assertNoUnsavedChangesDialog = () => {
  cy.findByRole('link', { name: /home/i }).click();
  cy.findByRole('heading', {
    name: 'ilmoitukset.tallentamattomiaMuutoksia.otsikko',
  }).should('not.exist');
};

export const fillAjankohtaFields = (
  alkamiskausityyppi = Alkamiskausityyppi.ALKAMISKAUSI_JA_VUOSI
) => {
  getByTestId('AloitusajankohtaFields').within(() => {
    switch (alkamiskausityyppi) {
      case Alkamiskausityyppi.ALKAMISKAUSI_JA_VUOSI:
        cy.findByText('yleiset.alkamiskausiJaVuosi').click();

        getRadio('kausi_k#1').click({ force: true });
        selectOption(2035);
        return;
      case Alkamiskausityyppi.TARKKA_ALKAMISAJANKOHTA:
        cy.findByText('yleiset.tarkkaAlkamisajankohta').click();

        getByTestId('alkaa').within(() => {
          fillDateTimeInput({
            date: '1.11.2030',
            time: '00:00',
          });
        });

        getByTestId('paattyy').within(() => {
          fillDateTimeInput({
            date: '30.11.2030',
            time: '00:00',
          });
        });
        return;
      case Alkamiskausityyppi.HENKILOKOHTAINEN_SUUNNITELMA:
        cy.findByText(
          'yleiset.aloitusHenkilokohtaisenSuunnitelmanMukaisesti'
        ).click();
        typeToEditor('Henkilökohtaisen suunnitelman lisätiedot');
    }
  });
};

/* Curried funktio, joka toteuttaa create ja edit testien yhteiset osat (tallennus-pyynnön vertaaminen snapshottiin).
 * "run" on funktio, joka ajaa muun testikoodin
 * options, objektissa entity on ENTITY-enum, jolle testi luodaan. oid/id on entiteetin tunniste
 * ("id" SORA-kuvauksella ja valintaperusteella)
 */
export const wrapMutationTest = options => run => () => {
  const { entity, oid, id } = options;

  const entityLower = toLower(entity);
  const requestAlias = `${entityLower}${uniqueId('Request')}`;

  cy.intercept(
    {
      method: '{PUT,POST}',
      url: `**/kouta-backend/${entityLower}`,
    },
    { body: oid ? { oid } : { id } }
  ).as(requestAlias);

  run();

  cy.wait(`@${requestAlias}`).then(({ request }) => {
    cy.wrap(request.body).toMatchSnapshot();
  });
};
