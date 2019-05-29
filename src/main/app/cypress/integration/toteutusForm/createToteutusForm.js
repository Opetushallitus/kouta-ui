import merge from 'lodash/merge';

import {
  getByTestId,
  getRadio,
  getSelectOption,
  getCheckbox,
  chooseKieliversiotLanguages,
  selectOption,
  fillTreeSelect,
} from '../../utils';

import koulutus from '../../data/koulutus';
import { stubToteutusFormRoutes } from '../../toteutusFormUtils';

const jatka = cy => {
  getByTestId('jatkaButton', cy).click({ force: true });
};

const fillPohjaSection = cy => {
  getByTestId('pohjaSection', cy).within(() => {
    jatka(cy);
  });
};

const fillKieliversiotSection = cy => {
  getByTestId('kieliversiotSection', cy).within(() => {
    chooseKieliversiotLanguages(['fi'], cy);
    jatka(cy);
  });
};

const fillOpetuskieli = cy => {
  getByTestId('opetuskieli', cy).within(() => {
    getCheckbox('oppilaitoksenopetuskieli_0#1', cy).click({ force: true });
    cy.get('textarea').type('opetuskieli kuvaus', { force: true });
  });
};

const fillOpetusaika = cy => {
  getByTestId('opetusaika', cy).within(() => {
    getCheckbox('opetusaikakk_0#1', cy).click({ force: true });
    cy.get('textarea').type('opetusaika kuvaus', { force: true });
  });
};

const fillOpetustapa = cy => {
  getByTestId('opetustapa', cy).within(() => {
    getCheckbox('opetuspaikkakk_0#1', cy).click({ force: true });
    cy.get('textarea').type('opetustapa kuvaus', { force: true });
  });
};

const fillMaksullisuus = (tyyppi, cy) => {
  getByTestId('maksullisuus', cy).within(() => {
    getRadio(tyyppi, cy).click({ force: true });
    getByTestId('maksu', cy)
      .find('input')
      .type('10');

    cy.getByTestId('maksullisuusKuvaus').within(() => {
      cy.get('textarea').type('maksullisuus kuvaus', { force: true });
    });
  });
};

const fillStipendi = cy => {
  getByTestId('stipendi', cy).within(() => {
    getRadio('kylla', cy).click({ force: true });
    getByTestId('stipendinMaara', cy)
      .find('input')
      .type('20');
    cy.get('textarea').type('stipendi kuvaus', { force: true });
  });
};

const fillKausi = cy => {
  getByTestId('alkamiskausi', cy).within(() => {
    getRadio('kausi_0#1', cy).click({ force: true });

    cy.getByTestId('vuosi').within(() => {
      selectOption(new Date().getFullYear().toString(), cy);
    });

    cy.get('textarea').type('kausi kuvaus');
  });
};

const fillOsiot = cy => {
  getByTestId('osiotSelect', cy).click();

  getByTestId('osiotSelect', cy).within(() => {
    getSelectOption('koulutuksenlisatiedot_0', cy).click({
      force: true,
    });
  });

  getByTestId('osioKuvaus.koulutuksenlisatiedot_0#1', cy)
    .find('textarea')
    .type('koulutuksenlisatiedot_0 kuvaus', { force: true });
};

const fillCommonJarjestamistiedot = ({ maksullisuusTyyppi = 'kylla', cy }) => {
  fillOpetuskieli(cy);
  fillOpetusaika(cy);
  fillOpetustapa(cy);
  fillMaksullisuus(maksullisuusTyyppi, cy);
  fillKausi(cy);
  fillOsiot(cy);
};

const fillNayttamistiedotSection = cy => {
  getByTestId('nayttamistiedotSection', cy).within(() => {
    getByTestId('ammattinimikkeetSelect', cy).click();

    getByTestId('ammattinimikkeetSelect', cy)
      .find('input[type="text"]')
      .type('ammattinimike', { force: true });

    getByTestId('ammattinimikkeetSelect', cy).within(() => {
      getSelectOption('Luo kohde', cy).click({ force: true });
    });

    getByTestId('avainsanatSelect', cy).click();

    getByTestId('avainsanatSelect', cy)
      .find('input[type="text"]')
      .type('avainsana', { force: true });

    getByTestId('avainsanatSelect', cy).within(() => {
      getSelectOption('Luo kohde', cy).click({ force: true });
    });

    jatka(cy);
  });
};

const tallenna = cy => {
  getByTestId('tallennaJaJulkaiseToteutusButton', cy).click({ force: true });
};

const fillJarjestajatSection = cy => {
  getByTestId('jarjestamispaikatSection', cy).within(() => {
    getByTestId('jarjestamispaikatSelection', cy).within(() => {
      fillTreeSelect(['4.1.1.1.1.1'], cy);
    });

    jatka(cy);
  });
};

const fillNimiSection = cy => {
  getByTestId('nimiSection', cy).within(() => {
    cy.get('input').type('toteutuksen nimi', { force: true });

    jatka(cy);
  });
};

const fillYhteystiedotSection = cy => {
  getByTestId('yhteystiedotSection', cy).within(() => {
    cy.getByTestId('lisaaYhteyshenkiloButton').click({ force: true });

    getByTestId('nimi', cy)
      .find('input')
      .type('nimi', { force: true });
    getByTestId('titteli', cy)
      .find('input')
      .type('titteli', { force: true });
    getByTestId('sahkoposti', cy)
      .find('input')
      .type('sähkoposti', { force: true });
    getByTestId('puhelinnumero', cy)
      .find('input')
      .type('puhelin', { force: true });
    getByTestId('verkkosivu', cy)
      .find('input')
      .type('verkkosivu', { force: true });
  });
};

const fillKkOsaamisalat = cy => {
  getByTestId('lisaaOsaamisalaButton', cy).click({ force: true });
  getByTestId('osaamisalanNimi', cy)
    .find('input')
    .type('osaamisalan nimi', { force: true });
  getByTestId('osaamisalanKuvaus', cy)
    .find('textarea')
    .type('osaamisalan kuvaus', { force: true });
  getByTestId('osaamisalanLinkki', cy)
    .find('input')
    .type('linkki', { force: true });
  getByTestId('osaamisalanOtsikko', cy)
    .find('input')
    .type('osaamisalan otsikko', { force: true });
};

const fillKuvausSection = cy => {
  getByTestId('kuvausSection', cy).within(() => {
    cy.get('textarea').type('toteutuksen kuvaus', { force: true });
    jatka(cy);
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

    fillPohjaSection(cy);
    fillKieliversiotSection(cy);

    getByTestId('osaamisalatSection', cy).within(() => {
      getByTestId('osaamisalaSelection', cy).within(() => {
        getCheckbox('osaamisala_0', cy).click({ force: true });
      });

      getByTestId('osaamisalaToggle.osaamisala_0', cy).click({ force: true });

      getByTestId('osaamisalaLinkki.osaamisala_0', cy)
        .find('input')
        .type('osaamisala_0 linkki', { force: true });

      getByTestId('osaamisalaOtsikko.osaamisala_0', cy)
        .find('input')
        .type('osaamisala_0 otsikko', { force: true });

      jatka(cy);
    });

    getByTestId('jarjestamistiedotSection', cy).within(() => {
      fillCommonJarjestamistiedot({ cy });
      jatka(cy);
    });

    fillNayttamistiedotSection(cy);
    fillJarjestajatSection(cy);
    fillNimiSection(cy);
    fillYhteystiedotSection(cy);

    tallenna(cy);

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

    fillPohjaSection(cy);
    fillKieliversiotSection(cy);
    fillKuvausSection(cy);

    getByTestId('alempiOsaamisalatSection', cy).within(() => {
      fillKkOsaamisalat(cy);
      jatka(cy);
    });

    getByTestId('ylempiOsaamisalatSection', cy).within(() => {
      fillKkOsaamisalat(cy);
      jatka(cy);
    });

    getByTestId('jarjestamistiedotSection', cy).within(() => {
      fillCommonJarjestamistiedot({ maksullisuusTyyppi: 'lukuvuosimaksu', cy });
      fillStipendi(cy);
      jatka(cy);
    });

    fillNayttamistiedotSection(cy);
    fillJarjestajatSection(cy);
    fillNimiSection(cy);
    fillYhteystiedotSection(cy);

    tallenna(cy);

    cy.wait('@createYoToteutusResponse').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });
  });
});
