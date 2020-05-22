import { merge } from 'lodash';

import {
  getRadio,
  getSelectOption,
  getCheckbox,
  chooseKieliversiotLanguages,
  selectOption,
  fillAsyncSelect,
  fillTreeSelect,
  jatka,
} from '#/cypress/utils';

import koulutus from '#/cypress/data/koulutus';
import { stubToteutusFormRoutes } from '#/cypress/toteutusFormUtils';

const fillTilaSection = (tila = 'julkaistu') => {
  cy.getByTestId('tilaSection').within(() => {
    getRadio(tila, cy).check({ force: true });
  });
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
    cy.get('textarea').paste('opetuskieli kuvaus');
  });
};

const fillOpetusaika = () => {
  cy.getByTestId('opetusaika').within(() => {
    getCheckbox('opetusaikakk_0#1', cy).click({ force: true });
    cy.get('textarea').paste('opetusaika kuvaus');
  });
};

const fillOpetustapa = () => {
  cy.getByTestId('opetustapa').within(() => {
    getCheckbox('opetuspaikkakk_0#1', cy).click({ force: true });
    cy.get('textarea').paste('opetustapa kuvaus');
  });
};

const fillMaksullisuus = tyyppi => {
  cy.getByTestId('maksullisuus').within(() => {
    getRadio(tyyppi, cy).click({ force: true });
    cy.getByTestId('maksu').find('input').paste('10');

    cy.getByTestId('maksullisuusKuvaus').within(() => {
      cy.get('textarea').paste('maksullisuus kuvaus');
    });
  });
};

const fillStipendi = () => {
  cy.getByTestId('stipendi').within(() => {
    getRadio('kylla', cy).click({ force: true });
    cy.getByTestId('stipendinMaara').find('input').paste('20');
    cy.get('textarea').paste('stipendi kuvaus');
  });
};

const fillKausi = () => {
  cy.getByTestId('koulutuksenAlkamisvuosi').within(() => {
    selectOption('2020', cy);
  });
  cy.getByTestId('koulutuksenAlkamiskausi').within(() => {
    getRadio('kausi_0#1', cy).check({ force: true });
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
    .paste('koulutuksenlisatiedot_0 kuvaus');
};

const fillCommonJarjestamistiedot = ({ maksullisuusTyyppi = 'kylla' } = {}) => {
  fillOpetuskieli();
  fillOpetusaika();
  fillOpetustapa();
  fillMaksullisuus(maksullisuusTyyppi);
  fillKausi();
  fillOsiot();
};

const fillTeemakuvaSection = () => {
  cy.getByTestId('teemakuvaSection').within(() => {
    jatka();
  });
};

const fillNayttamistiedotSection = () => {
  cy.getByTestId('nayttamistiedotSection').within(() => {
    cy.getByTestId('ammattinimikkeetSelect').within(() => {
      fillAsyncSelect('ammattinimike', 'Luo kohde');
    });

    cy.getByTestId('avainsanatSelect').within(() => {
      fillAsyncSelect('avainsana', 'Luo kohde');
    });

    jatka();
  });
};

const tallenna = () => {
  cy.getByTestId('tallennaToteutusButton').click({ force: true });
};

const fillJarjestajatSection = () => {
  cy.getByTestId('tarjoajatSection').within(() => {
    cy.getByTestId('jarjestamispaikatSelection').within(() => {
      fillTreeSelect(['1.2.2.1.1.1'], cy);
    });

    jatka();
  });
};

const fillTiedotSection = () => {
  cy.getByTestId('tiedotSection').within(() => {
    cy.getByTestId('toteutuksenNimi')
      .find('input')
      .clear({ force: true })
      .paste('toteutuksen nimi');

    cy.getByTestId('toteutuksenKuvaus')
      .find('textarea')
      .paste('Toteutuksen kuvaus');

    jatka();
  });
};

const fillYhteystiedotSection = () => {
  cy.getByTestId('yhteyshenkilotSection').within(() => {
    cy.getByTestId('lisaaYhteyshenkiloButton').click({ force: true });

    cy.getByTestId('nimi').find('input').paste('nimi');
    cy.getByTestId('titteli').find('input').paste('titteli');
    cy.getByTestId('sahkoposti').find('input').paste('sähkoposti');
    cy.getByTestId('puhelinnumero').find('input').paste('puhelin');
    cy.getByTestId('verkkosivu').find('input').paste('verkkosivu');

    jatka();
  });
};

const fillKkOsaamisalat = () => {
  cy.getByTestId('lisaaOsaamisalaButton').click({ force: true });
  cy.getByTestId('osaamisalanNimi').find('input').paste('osaamisalan nimi');
  cy.getByTestId('osaamisalanKuvaus')
    .find('textarea')
    .paste('osaamisalan kuvaus');
  cy.getByTestId('osaamisalanLinkki').find('input').paste('linkki');
  cy.getByTestId('osaamisalanOtsikko')
    .find('input')
    .paste('osaamisalan otsikko');
};

const fillLukiolinjatSection = () => {
  cy.getByTestId('lukiolinjatSection').within(() => {
    cy.getByTestId('lukiolinja').within(() => {
      selectOption('lukiolinjat_0', cy);
    });

    jatka();
  });
};

const fillDiplomi = () => {
  cy.getByTestId('diplomiTyypit').within(() => {
    selectOption('lukiodiplomit_0', cy);
  });

  cy.getByTestId('diplomiKuvaus').find('textarea').paste('Diplomi kuvaus');
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

const prepareTest = tyyppi => {
  const organisaatioOid = '1.1.1.1.1.1';
  const koulutusOid = '1.2.1.1.1.1';
  const perusteId = '1';

  const testKoulutusFields = {
    oid: koulutusOid,
    organisaatioOid: organisaatioOid,
    koulutusKoodiUri: 'koulutus_0#1',
    tarjoajat: ['1.2.2.1.1.1'],
    tila: 'julkaistu',
  };

  stubToteutusFormRoutes({ cy, perusteId, organisaatioOid });
  cy.route({
    method: 'GET',
    url: `**/koulutus/${koulutusOid}`,
    response: merge(koulutus({ tyyppi }), testKoulutusFields),
  });
  cy.visit(`/organisaatio/${organisaatioOid}/koulutus/${koulutusOid}/toteutus`);
};

describe('createToteutusForm', () => {
  it('should be able to create ammatillinen toteutus', () => {
    prepareTest('amm');

    cy.route({
      method: 'PUT',
      url: '**/toteutus',
      response: {
        oid: '1.2.3.4.5.6',
      },
    }).as('createAmmToteutusResponse');

    fillPohjaSection();
    fillKieliversiotSection();
    fillTiedotSection();

    cy.getByTestId('osaamisalatSection').within(() => {
      cy.getByTestId('osaamisalaSelection').within(() => {
        getCheckbox('osaamisala_0', cy).click({ force: true });
      });

      cy.getByTestId('osaamisalaToggle.osaamisala_0').click({ force: true });

      cy.getByTestId('osaamisalaLinkki.osaamisala_0')
        .find('input')
        .paste('osaamisala_0 linkki');

      cy.getByTestId('osaamisalaOtsikko.osaamisala_0')
        .find('input')
        .paste('osaamisala_0 otsikko');

      jatka();
    });

    cy.getByTestId('jarjestamistiedotSection').within(() => {
      fillCommonJarjestamistiedot();
      jatka();
    });

    fillTeemakuvaSection();
    fillNayttamistiedotSection();
    fillJarjestajatSection();
    fillYhteystiedotSection();
    fillTilaSection();

    tallenna();

    cy.wait('@createAmmToteutusResponse').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });
  });

  it('should be able to create korkeakoulu toteutus', () => {
    prepareTest('yo');

    cy.route({
      method: 'PUT',
      url: '**/toteutus',
      response: {
        oid: '1.2.3.4.5.6',
      },
    }).as('createYoToteutusResponse');

    fillPohjaSection();
    fillKieliversiotSection();
    fillTiedotSection();

    cy.getByTestId('alemmanKorkeakoulututkinnonOsaamisalatSection').within(
      () => {
        fillKkOsaamisalat();
        jatka();
      }
    );

    cy.getByTestId('ylemmanKorkeakoulututkinnonOsaamisalatSection').within(
      () => {
        fillKkOsaamisalat();
        jatka();
      }
    );

    cy.getByTestId('jarjestamistiedotSection').within(() => {
      fillCommonJarjestamistiedot({ maksullisuusTyyppi: 'lukuvuosimaksu' });
      fillStipendi();
      jatka();
    });

    fillTeemakuvaSection();
    fillNayttamistiedotSection();
    fillJarjestajatSection();
    fillYhteystiedotSection();
    fillTilaSection();

    tallenna();

    cy.wait('@createYoToteutusResponse').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });
  });

  it('should be able to create lukio toteutus', () => {
    prepareTest('lk');

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

    fillTeemakuvaSection();
    fillNayttamistiedotSection();
    fillJarjestajatSection();
    fillYhteystiedotSection();
    fillTilaSection();

    tallenna();

    cy.wait('@createLkToteutusResponse').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });
  });
});
