import merge from 'lodash/merge';

import {
  getRadio,
  getSelectOption,
  getCheckbox,
  chooseKieliversiotLanguages,
  selectOption,
  fillTreeSelect,
  fillDatePickerInput,
} from '../../utils';

import koulutus from '../../data/koulutus';
import { stubToteutusFormRoutes } from '../../toteutusFormUtils';

const jatka = () => {
  cy.getByTestId('jatkaButton').click({ force: true });
};

const fillPohjaSection = () => {
  cy.getByTestId('pohjaSection').within(() => {
    jatka();
  });
};

const fillKieliversiotSection = () => {
  cy.getByTestId('kieliversiotSection').within(() => {
    chooseKieliversiotLanguages(['fi'], cy);
    jatka();
  });
};

const fillOpetuskieli = () => {
  cy.getByTestId('opetuskieli').within(() => {
    getCheckbox('oppilaitoksenopetuskieli_0#1', cy).click({ force: true });
    cy.get('textarea').type('opetuskieli kuvaus', { force: true });
  });
};

const fillOpetusaika = () => {
  cy.getByTestId('opetusaika').within(() => {
    getCheckbox('opetusaikakk_0#1', cy).click({ force: true });
    cy.get('textarea').type('opetusaika kuvaus', { force: true });
  });
};

const fillOpetustapa = () => {
  cy.getByTestId('opetustapa').within(() => {
    getCheckbox('opetuspaikkakk_0#1', cy).click({ force: true });
    cy.get('textarea').type('opetustapa kuvaus', { force: true });
  });
};

const fillMaksullisuus = tyyppi => {
  cy.getByTestId('maksullisuus').within(() => {
    getRadio(tyyppi, cy).click({ force: true });
    cy.getByTestId('maksu')
      .find('input')
      .type('10');

    cy.getByTestId('maksullisuusKuvaus').within(() => {
      cy.get('textarea').type('maksullisuus kuvaus', { force: true });
    });
  });
};

const fillStipendi = () => {
  cy.getByTestId('stipendi').within(() => {
    getRadio('kylla', cy).click({ force: true });
    cy.getByTestId('stipendinMaara')
      .find('input')
      .type('20');
    cy.get('textarea').type('stipendi kuvaus', { force: true });
  });
};

const fillKausi = () => {
  cy.getByTestId('koulutuksenAlkamispaivamaara').within(() => {
    fillDatePickerInput('1.1.2019');
  });

  cy.getByTestId('koulutuksenPaattymispaivamaara').within(() => {
    fillDatePickerInput('15.2.2019');
  });
};

const fillOsiot = () => {
  cy.getByTestId('osiotSelect').click();

  cy.getByTestId('osiotSelect').within(() => {
    getSelectOption('koulutuksenlisatiedot_0', cy).click({
      force: true,
    });
  });

  cy.getByTestId('osioKuvaus.koulutuksenlisatiedot_0#1')
    .find('textarea')
    .type('koulutuksenlisatiedot_0 kuvaus', { force: true });
};

const fillCommonJarjestamistiedot = ({ maksullisuusTyyppi = 'kylla' } = {}) => {
  fillOpetuskieli();
  fillOpetusaika();
  fillOpetustapa();
  fillMaksullisuus(maksullisuusTyyppi);
  fillKausi();
  fillOsiot();
};

const fillNayttamistiedotSection = () => {
  cy.getByTestId('nayttamistiedotSection').within(() => {
    cy.getByTestId('ammattinimikkeetSelect').click();

    cy.getByTestId('ammattinimikkeetSelect')
      .find('input[type="text"]')
      .type('ammattinimike', { force: true });

    cy.getByTestId('ammattinimikkeetSelect').within(() => {
      getSelectOption('Luo kohde', cy).click({ force: true });
    });

    cy.getByTestId('avainsanatSelect').click();

    cy.getByTestId('avainsanatSelect')
      .find('input[type="text"]')
      .type('avainsana', { force: true });

    cy.getByTestId('avainsanatSelect').within(() => {
      getSelectOption('Luo kohde', cy).click({ force: true });
    });

    jatka();
  });
};

const tallenna = () => {
  cy.getByTestId('tallennaJaJulkaiseToteutusButton').click({ force: true });
};

const fillJarjestajatSection = () => {
  cy.getByTestId('jarjestamispaikatSection').within(() => {
    cy.getByTestId('jarjestamispaikatSelection').within(() => {
      fillTreeSelect(['4.1.1.1.1.1'], cy);
    });

    jatka();
  });
};

const fillNimiSection = () => {
  cy.getByTestId('nimiSection').within(() => {
    cy.get('input').type('toteutuksen nimi', { force: true });

    jatka();
  });
};

const fillYhteystiedotSection = () => {
  cy.getByTestId('yhteystiedotSection').within(() => {
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
  });
};

const fillKkOsaamisalat = () => {
  cy.getByTestId('lisaaOsaamisalaButton').click({ force: true });
  cy.getByTestId('osaamisalanNimi')
    .find('input')
    .type('osaamisalan nimi', { force: true });
  cy.getByTestId('osaamisalanKuvaus')
    .find('textarea')
    .type('osaamisalan kuvaus', { force: true });
  cy.getByTestId('osaamisalanLinkki')
    .find('input')
    .type('linkki', { force: true });
  cy.getByTestId('osaamisalanOtsikko')
    .find('input')
    .type('osaamisalan otsikko', { force: true });
};

const fillKuvausSection = () => {
  cy.getByTestId('kuvausSection').within(() => {
    cy.get('textarea').type('toteutuksen kuvaus', { force: true });
    jatka();
  });
};

const fillLukiolinjatSection = () => {
  cy.getByTestId('lukiolinjatSection').within(() => {
    cy.getByTestId('linja').within(() => {
      selectOption('lukiolinjat_0', cy);
    });

    cy.getByTestId('jaksonKuvaus')
      .find('textarea')
      .type('Jakson kuvaus', { force: true });

    jatka();
  });
};

const fillDiplomi = () => {
  cy.getByTestId('diplomiTyypit').within(() => {
    selectOption('lukiodiplomit_0', cy);
  });

  cy.getByTestId('diplomiKuvaus')
    .find('textarea')
    .type('Diplomi kuvaus', { force: true });
};

const fillKielivalikoima = () => {
  cy.getByTestId('A1A2Kielet').within(() => {
    selectOption('kieli_0', cy);
  });

  cy.getByTestId('B2Kielet').within(() => {
    selectOption('kieli_1', cy);
  });

  cy.getByTestId('aidinkielet').within(() => {
    selectOption('kieli_2', cy);
  });

  cy.getByTestId('B1Kielet').within(() => {
    selectOption('kieli_3', cy);
  });

  cy.getByTestId('B3Kielet').within(() => {
    selectOption('kieli_4', cy);
  });

  cy.getByTestId('muutKielet').within(() => {
    selectOption('kieli_4', cy);
  });
};

describe('createToteutusForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const koulutusOid = '1.2.1.1.1.1';
  const perusteId = '1';

  const testKoulutusFields = {
    oid: koulutusOid,
    organisaatioOid: organisaatioOid,
    koulutusKoodiUri: 'koulutus_0#1',
    tarjoajat: ['4.1.1.1.1.1', '2.1.1.1.1.1'],
  };

  beforeEach(() => {
    stubToteutusFormRoutes({ cy, perusteId, organisaatioOid });

    cy.visit(
      `/organisaatio/${organisaatioOid}/koulutus/${koulutusOid}/toteutus`,
    );
  });

  it('should be able to create ammatillinen toteutus', () => {
    cy.route({
      method: 'GET',
      url: `**/koulutus/${koulutusOid}`,
      response: merge(koulutus({ tyyppi: 'amm' }), testKoulutusFields),
    });

    cy.route({
      method: 'PUT',
      url: '**/toteutus',
      response: {
        oid: '1.2.3.4.5.6',
      },
    }).as('createAmmToteutusResponse');

    fillPohjaSection();
    fillKieliversiotSection();

    cy.getByTestId('osaamisalatSection').within(() => {
      cy.getByTestId('osaamisalaSelection').within(() => {
        getCheckbox('osaamisala_0', cy).click({ force: true });
      });

      cy.getByTestId('osaamisalaToggle.osaamisala_0').click({ force: true });

      cy.getByTestId('osaamisalaLinkki.osaamisala_0')
        .find('input')
        .type('osaamisala_0 linkki', { force: true });

      cy.getByTestId('osaamisalaOtsikko.osaamisala_0')
        .find('input')
        .type('osaamisala_0 otsikko', { force: true });

      jatka();
    });

    cy.getByTestId('jarjestamistiedotSection').within(() => {
      fillCommonJarjestamistiedot();
      jatka();
    });

    fillNayttamistiedotSection();
    fillJarjestajatSection();
    fillNimiSection();
    fillYhteystiedotSection();

    tallenna();

    cy.wait('@createAmmToteutusResponse').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });
  });

  it('should be able to create korkeakoulu toteutus', () => {
    cy.route({
      method: 'GET',
      url: `**/koulutus/${koulutusOid}`,
      response: merge(koulutus({ tyyppi: 'yo' }), testKoulutusFields),
    });

    cy.route({
      method: 'PUT',
      url: '**/toteutus',
      response: {
        oid: '1.2.3.4.5.6',
      },
    }).as('createYoToteutusResponse');

    fillPohjaSection();
    fillKieliversiotSection();
    fillKuvausSection();

    cy.getByTestId('alempiOsaamisalatSection').within(() => {
      fillKkOsaamisalat();
      jatka();
    });

    cy.getByTestId('ylempiOsaamisalatSection').within(() => {
      fillKkOsaamisalat();
      jatka();
    });

    cy.getByTestId('jarjestamistiedotSection').within(() => {
      fillCommonJarjestamistiedot({ maksullisuusTyyppi: 'lukuvuosimaksu' });
      fillStipendi();
      jatka();
    });

    fillNayttamistiedotSection();
    fillJarjestajatSection();
    fillNimiSection();
    fillYhteystiedotSection();

    tallenna();

    cy.wait('@createYoToteutusResponse').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });
  });

  it('should be able to create lukio toteutus', () => {
    cy.route({
      method: 'GET',
      url: `**/koulutus/${koulutusOid}`,
      response: merge(koulutus({ tyyppi: 'lk' }), testKoulutusFields),
    });

    cy.route({
      method: 'PUT',
      url: '**/toteutus',
      response: {
        oid: '1.2.3.4.5.6',
      },
    }).as('createLkToteutusResponse');

    fillPohjaSection();
    fillKieliversiotSection();
    fillLukiolinjatSection();

    cy.getByTestId('jarjestamistiedotSection').within(() => {
      fillCommonJarjestamistiedot();
      fillStipendi();
      fillDiplomi();
      fillKielivalikoima();
      jatka();
    });

    fillNayttamistiedotSection();
    fillJarjestajatSection();
    fillYhteystiedotSection();

    tallenna();

    cy.wait('@createLkToteutusResponse').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });
  });
});
