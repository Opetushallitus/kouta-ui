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
  getByTestId,
} from '#/cypress/utils';

import koulutus from '#/cypress/data/koulutus';
import { stubToteutusFormRoutes } from '#/cypress/toteutusFormUtils';

const fillTilaSection = (tila = 'julkaistu') => {
  getByTestId('tilaSection').within(() => {
    getRadio(tila).check({ force: true });
  });
};

const fillPohjaSection = () => {
  getByTestId('pohjaSection').within(() => {
    jatka();
  });
};

const fillKieliversiotSection = () => {
  getByTestId('kieliversiotSection').within(() => {
    chooseKieliversiotLanguages(['fi']);
    jatka();
  });
};

const fillOpetuskieli = () => {
  getByTestId('opetuskieli').within(() => {
    getCheckbox('oppilaitoksenopetuskieli_0#1').click({ force: true });
    cy.get('textarea').paste('opetuskieli kuvaus');
  });
};

const fillOpetusaika = () => {
  getByTestId('opetusaika').within(() => {
    getCheckbox('opetusaikakk_0#1').click({ force: true });
    cy.get('textarea').paste('opetusaika kuvaus');
  });
};

const fillOpetustapa = () => {
  getByTestId('opetustapa').within(() => {
    getCheckbox('opetuspaikkakk_0#1').click({ force: true });
    cy.get('textarea').paste('opetustapa kuvaus');
  });
};

const fillMaksullisuus = tyyppi => {
  getByTestId('maksullisuus').within(() => {
    getRadio(tyyppi).click({ force: true });
    getByTestId('maksu').find('input').paste('10');

    getByTestId('maksullisuusKuvaus').within(() => {
      cy.get('textarea').paste('maksullisuus kuvaus');
    });
  });
};

const fillStipendi = () => {
  getByTestId('stipendi').within(() => {
    getRadio('kylla').click({ force: true });
    getByTestId('stipendinMaara').find('input').paste('20');
    cy.get('textarea').paste('stipendi kuvaus');
  });
};

const fillKausi = () => {
  getByTestId('koulutuksenAlkamisvuosi').within(() => {
    selectOption('2020');
  });
  getByTestId('koulutuksenAlkamiskausi').within(() => {
    getRadio('kausi_0#1').check({ force: true });
  });
};

const fillOsiot = () => {
  getByTestId('osiotSelect').click();

  getByTestId('osiotSelect').within(() => {
    getSelectOption('koulutuksenlisatiedot_0').click({
      force: true,
    });
  });

  getByTestId('osioKuvaus.koulutuksenlisatiedot_0#1')
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
  getByTestId('teemakuvaSection').within(() => {
    jatka();
  });
};

const fillNayttamistiedotSection = () => {
  getByTestId('nayttamistiedotSection').within(() => {
    getByTestId('ammattinimikkeetSelect').within(() => {
      fillAsyncSelect('ammattinimike', 'Luo kohde');
    });

    getByTestId('avainsanatSelect').within(() => {
      fillAsyncSelect('avainsana', 'Luo kohde');
    });

    jatka();
  });
};

const tallenna = () => {
  getByTestId('tallennaToteutusButton').click({ force: true });
};

const fillJarjestajatSection = () => {
  getByTestId('tarjoajatSection').within(() => {
    getByTestId('jarjestamispaikatSelection').within(() => {
      fillTreeSelect(['1.2.2.1.1.1']);
    });

    jatka();
  });
};

const fillTiedotSection = () => {
  getByTestId('tiedotSection').within(() => {
    getByTestId('toteutuksenNimi')
      .find('input')
      .clear({ force: true })
      .paste('toteutuksen nimi');

    getByTestId('toteutuksenKuvaus')
      .find('textarea')
      .paste('Toteutuksen kuvaus');

    jatka();
  });
};

const fillYhteystiedotSection = () => {
  getByTestId('yhteyshenkilotSection').within(() => {
    getByTestId('lisaaYhteyshenkiloButton').click({ force: true });

    getByTestId('nimi').find('input').paste('nimi');
    getByTestId('titteli').find('input').paste('titteli');
    getByTestId('sahkoposti').find('input').paste('sähkoposti');
    getByTestId('puhelinnumero').find('input').paste('puhelin');
    getByTestId('verkkosivu').find('input').paste('verkkosivu');

    jatka();
  });
};

const fillKkOsaamisalat = () => {
  getByTestId('lisaaOsaamisalaButton').click({ force: true });
  getByTestId('osaamisalanNimi').find('input').paste('osaamisalan nimi');
  getByTestId('osaamisalanKuvaus').find('textarea').paste('osaamisalan kuvaus');
  getByTestId('osaamisalanLinkki').find('input').paste('linkki');
  getByTestId('osaamisalanOtsikko').find('input').paste('osaamisalan otsikko');
};

const fillLukiolinjatSection = () => {
  getByTestId('lukiolinjatSection').within(() => {
    getByTestId('lukiolinja').within(() => {
      selectOption('lukiolinjat_0');
    });

    jatka();
  });
};

const fillDiplomi = () => {
  getByTestId('diplomiTyypit').within(() => {
    selectOption('lukiodiplomit_0');
  });

  getByTestId('diplomiKuvaus').find('textarea').paste('Diplomi kuvaus');
};

const fillKielivalikoima = () => {
  getByTestId('A1A2Kielet').within(() => {
    selectOption('kieli_0');
  });

  getByTestId('B2Kielet').within(() => {
    selectOption('kieli_1');
  });

  getByTestId('aidinkielet').within(() => {
    selectOption('kieli_2');
  });

  getByTestId('B1Kielet').within(() => {
    selectOption('kieli_3');
  });

  getByTestId('B3Kielet').within(() => {
    selectOption('kieli_4');
  });

  getByTestId('muutKielet').within(() => {
    selectOption('kieli_4');
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

  cy.server();

  stubToteutusFormRoutes({ perusteId, organisaatioOid });
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

    getByTestId('osaamisalatSection').within(() => {
      getByTestId('osaamisalaSelection').within(() => {
        getCheckbox('osaamisala_0').click({ force: true });
      });

      getByTestId('osaamisalaToggle.osaamisala_0').click({ force: true });

      getByTestId('osaamisalaLinkki.osaamisala_0')
        .find('input')
        .paste('osaamisala_0 linkki');

      getByTestId('osaamisalaOtsikko.osaamisala_0')
        .find('input')
        .paste('osaamisala_0 otsikko');

      jatka();
    });

    getByTestId('jarjestamistiedotSection').within(() => {
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

    getByTestId('alemmanKorkeakoulututkinnonOsaamisalatSection').within(() => {
      fillKkOsaamisalat();
      jatka();
    });

    getByTestId('ylemmanKorkeakoulututkinnonOsaamisalatSection').within(() => {
      fillKkOsaamisalat();
      jatka();
    });

    getByTestId('jarjestamistiedotSection').within(() => {
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

    getByTestId('jarjestamistiedotSection').within(() => {
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
