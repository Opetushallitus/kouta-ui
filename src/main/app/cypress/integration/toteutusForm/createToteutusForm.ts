import _fp from 'lodash/fp';

import {
  getRadio,
  getSelectOption,
  getCheckbox,
  selectOption,
  fillAsyncSelect,
  fillTreeSelect,
  jatka,
  getByTestId,
  paste,
  fillKieliversiotSection,
  fillPohjaSection,
  typeToEditor,
  fillTilaSection,
  tallenna,
  fillDateTimeInput,
  fillYhteyshenkilotFields,
} from '#/cypress/utils';

import koulutus from '#/cypress/data/koulutus';
import { stubToteutusFormRoutes } from '#/cypress/toteutusFormUtils';

const fillOpetuskieli = (chosenNumber = '0') => {
  getByTestId('opetuskieli').within(() => {
    getCheckbox(`oppilaitoksenopetuskieli_${chosenNumber}#1`).click({
      force: true,
    });
    typeToEditor('opetuskieli kuvaus');
  });
};

const fillSuunniteltuKesto = () => {
  getByTestId('suunniteltuKesto').within(() => {
    getByTestId('suunniteltuKestoVuotta').type('2');
    getByTestId('suunniteltuKestoKuukautta').type('6');
    typeToEditor('suunniteltu kesto kuvaus');
  });
};

const fillOpetusaika = () => {
  getByTestId('opetusaika').within(() => {
    getCheckbox('opetusaikakk_0#1').click({ force: true });
    typeToEditor('opetusaika kuvaus');
  });
};

const fillOpetustapa = () => {
  getByTestId('opetustapa').within(() => {
    getCheckbox('opetuspaikkakk_0#1').click({ force: true });
    typeToEditor('opetustapa kuvaus');
  });
};

const fillMaksullisuus = tyyppi => {
  getByTestId('maksullisuus').within(() => {
    getRadio(tyyppi).click({ force: true });
    getByTestId('maksu').find('input').pipe(paste('10'));
    typeToEditor('maksullisuus kuvaus');
  });
};

const fillStipendi = () => {
  getByTestId('stipendi').within(() => {
    getRadio('kylla').click({ force: true });
    getByTestId('stipendinMaara').find('input').pipe(paste('20'));
    typeToEditor('stipendi kuvaus');
  });
};

const fillKausi = () => {
  cy.findByText('hakulomake.alkamiskausi').click();

  getByTestId('KausiJaVuosiFields').within(() => {
    getRadio('kausi_0#1').click({ force: true });
    selectOption(2035);

    cy.findByText('hakulomake.tiedossaTarkkaAjankohta').click();

    getByTestId('alkaa').within(() => {
      fillDateTimeInput({
        date: '1.11.2020',
        time: '00:00',
      });
    });

    getByTestId('paattyy').within(() => {
      fillDateTimeInput({
        date: '30.11.2020',
        time: '00:00',
      });
    });
  });
};

const fillOsiot = () => {
  getByTestId('osiotSelect').click();

  getByTestId('osiotSelect').within(() => {
    getSelectOption('koulutuksenlisatiedot_0').click({
      force: true,
    });
  });

  getByTestId('osioKuvaus.koulutuksenlisatiedot_0#1').within(() => {
    typeToEditor('koulutuksenlisatiedot_0 kuvaus');
  });
};

const fillCommonJarjestamistiedot = ({ maksullisuusTyyppi = 'kylla' } = {}) => {
  fillOpetuskieli();
  fillSuunniteltuKesto();
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

const fillNayttamistiedotSection = (
  { ammattinimikkeet } = { ammattinimikkeet: true }
) => {
  getByTestId('nayttamistiedotSection').within(() => {
    if (ammattinimikkeet) {
      getByTestId('ammattinimikkeetSelect').within(() => {
        fillAsyncSelect('ammattinimike', 'yleiset.luoKohde');
      });
    }

    getByTestId('avainsanatSelect').within(() => {
      fillAsyncSelect('avainsana', 'yleiset.luoKohde');
    });

    jatka();
  });
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
      .pipe(paste('toteutuksen nimi'));

    jatka();
  });
};

const fillKuvausSection = () => {
  getByTestId('kuvausSection').within(() => {
    getByTestId('toteutuksenKuvaus').within(() => {
      typeToEditor('Toteutuksen kuvaus');
    });
    jatka();
  });
};

const fillYhteystiedotSection = () => {
  getByTestId('yhteyshenkilotSection').within(() => {
    fillYhteyshenkilotFields();
    jatka();
  });
};

const fillKkOsaamisalat = () => {
  getByTestId('lisaaOsaamisalaButton').click({ force: true });
  getByTestId('osaamisalanNimi').find('input').pipe(paste('osaamisalan nimi'));
  getByTestId('osaamisalanKuvaus').within(() => {
    typeToEditor('osaamisalan kuvaus');
  });
  getByTestId('osaamisalanLinkki')
    .find('input')
    .pipe(paste('http://linkki.com'));
  getByTestId('osaamisalanOtsikko')
    .find('input')
    .pipe(paste('osaamisalan otsikko'));
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

  getByTestId('diplomiKuvaus').within(() => {
    typeToEditor('Diplomi kuvaus');
  });
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

const toteutusOid = '1.2.3.4.5.6';

const prepareTest = tyyppi => {
  const organisaatioOid = '1.1.1.1.1.1';
  const koulutusOid = '1.2.1.1.1.1';
  const perusteId = 6777660;

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
    response: _fp.merge(koulutus({ tyyppi }), testKoulutusFields),
  });

  cy.route({
    method: 'GET',
    url: `**/toteutus/${toteutusOid}`,
    response: [],
  });

  cy.visit(`/organisaatio/${organisaatioOid}/koulutus/${koulutusOid}/toteutus`);
};

export const createToteutusForm = () => {
  it('should be able to create ammatillinen tutkinnon osa toteutus', () => {
    prepareTest('amm-tutkinnon-osa');

    cy.route({
      method: 'PUT',
      url: '**/toteutus',
      response: {
        oid: toteutusOid,
      },
    }).as('createAmmToteutusResponse');

    fillPohjaSection();
    fillKieliversiotSection({ jatka: true });
    fillTiedotSection();
    fillKuvausSection();

    getByTestId('jarjestamistiedotSection').within(() => {
      fillCommonJarjestamistiedot();
      jatka();
    });

    fillTeemakuvaSection();
    fillNayttamistiedotSection({ ammattinimikkeet: false });
    fillJarjestajatSection();

    cy.findByTestId('soraKuvausSection').should('not.exist');

    getByTestId('hakeutumisTaiIlmoittautumistapaSection').within(() => {
      cy.findByRole('button', {
        name: 'toteutuslomake.hakuTapa.hakeutuminen',
      }).click();

      cy.findByRole('button', {
        name: 'toteutuslomake.hakuTapa.hakeutuminen',
      }).click();

      cy.findByText('toteutuslomake.muuHakulomake').click();

      cy.findByRole('textbox', {
        name: /^toteutuslomake.hakeutuminen.linkki/,
      })
        .click()
        .pipe(paste('http://example.com'));

      cy.findByRole('textbox', {
        name: /^toteutuslomake.hakeutuminen.lisatiedot/,
      })
        .click()
        .pipe(paste('lisätiedot'));

      cy.findByRole('textbox', {
        name: /^toteutuslomake.lisatiedotValintaperusteista/,
      })
        .click()
        .pipe(paste('lisätiedot valintaperusteista'));

      cy.findByTestId('alkaa').within(() => {
        fillDateTimeInput({
          date: '01.04.2050',
          time: '00:00',
        });
      });

      cy.findByTestId('paattyy').within(() => {
        fillDateTimeInput({
          date: '01.09.2050',
          time: '00:00',
        });
      });

      jatka();
    });

    getByTestId('soraKuvausSection').within(() => {
      jatka();
    });

    fillYhteystiedotSection();
    fillTilaSection();

    tallenna();

    cy.wait('@createAmmToteutusResponse').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

  it('should be able to create ammatillinen toteutus', () => {
    prepareTest('amm');

    cy.route({
      method: 'PUT',
      url: '**/toteutus',
      response: {
        oid: toteutusOid,
      },
    }).as('createAmmToteutusResponse');

    fillPohjaSection();
    fillKieliversiotSection({ jatka: true });
    fillTiedotSection();
    fillKuvausSection();

    getByTestId('osaamisalatSection').within(() => {
      getByTestId('osaamisalaSelection').within(() => {
        getCheckbox('osaamisala_0').click({ force: true });
      });

      getByTestId('osaamisalaToggle.osaamisala_0').click({ force: true });

      getByTestId('osaamisalaLinkki.osaamisala_0')
        .find('input')
        .pipe(paste('http://linkki.com'));

      getByTestId('osaamisalaOtsikko.osaamisala_0')
        .find('input')
        .pipe(paste('osaamisala_0 otsikko'));

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
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

  it('should be able to create korkeakoulu toteutus', () => {
    prepareTest('yo');

    cy.route({
      method: 'PUT',
      url: '**/toteutus',
      response: {
        oid: toteutusOid,
      },
    }).as('createYoToteutusResponse');

    fillPohjaSection();
    fillKieliversiotSection({ jatka: true });
    fillTiedotSection();
    fillKuvausSection();

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
      cy.findByTestId('stipendi').should('not.exist');
      fillOpetuskieli('4'); // "englanti" is needed for stipendi to show up
      cy.findByTestId('stipendi').should('exist');
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
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

  it('should be able to create lukio toteutus', () => {
    prepareTest('lk');

    cy.route({
      method: 'PUT',
      url: '**/toteutus',
      response: {
        oid: toteutusOid,
      },
    }).as('createLkToteutusResponse');

    fillPohjaSection();
    fillKieliversiotSection({ jatka: true });
    fillLukiolinjatSection();

    getByTestId('jarjestamistiedotSection').within(() => {
      fillCommonJarjestamistiedot();
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
      cy.wrap(request.body).toMatchSnapshot();
    });
  });
};
