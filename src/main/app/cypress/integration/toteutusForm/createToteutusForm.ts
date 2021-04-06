import { playMocks } from 'kto-ui-common/cypress/mockUtils';
import _fp from 'lodash/fp';

import koulutus from '#/cypress/data/koulutus';
import toteutusMocks from '#/cypress/mocks/toteutus.mocks.json';
import { stubToteutusFormRoutes } from '#/cypress/toteutusFormUtils';
import {
  getRadio,
  getSelectOption,
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
  fillAjankohtaFields,
  selectCheckbox,
} from '#/cypress/utils';
import { Alkamiskausityyppi } from '#/src/constants';
import { MaksullisuusTyyppi } from '#/src/types/toteutusTypes';

const fillOpetuskieli = (chosenLang = 'suomi') => {
  getByTestId('opetuskieli').within(() => {
    selectCheckbox(chosenLang);
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
    selectCheckbox('Päiväopetus');
    typeToEditor('opetusaika kuvaus');
  });
};

const fillOpetustapa = () => {
  getByTestId('opetustapa').within(() => {
    selectCheckbox('Lähiopetus');
    typeToEditor('opetustapa kuvaus');
  });
};

const fillMaksullisuus = tyyppi => {
  getByTestId('maksullisuus').within(() => {
    getRadio(tyyppi).click({ force: true });
    cy.findByPlaceholderText('yleiset.maara').pipe(paste('10'));
    typeToEditor('maksullisuus kuvaus');
  });
};

const fillApuraha = () => {
  getByTestId('apuraha').within(() => {
    cy.findByLabelText('toteutuslomake.apurahaKaytossa').click({ force: true });
    getByTestId('apurahaMin').find('input').pipe(paste('20'));
    typeToEditor('apuraha kuvaus');
  });
};

const fillOsiot = () => {
  getByTestId('osiotSelect').click();

  getByTestId('osiotSelect').within(() => {
    getSelectOption('Opintojen rakenne').click({
      force: true,
    });
  });

  getByTestId('osioKuvaus.koulutuksenlisatiedot_01#1').within(() => {
    typeToEditor('koulutuksenlisatiedot_0 kuvaus');
  });
};

const fillCommonJarjestamistiedot = ({
  maksullisuusTyyppi = MaksullisuusTyyppi.MAKSULLINEN,
} = {}) => {
  fillOpetuskieli();
  fillSuunniteltuKesto();
  fillOpetusaika();
  fillOpetustapa();
  fillMaksullisuus(maksullisuusTyyppi);
  fillAjankohtaFields(Alkamiskausityyppi.ALKAMISKAUSI_JA_VUOSI);
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

/*
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
*/

const fillLukiolinjatSection = () => {
  getByTestId('lukiolinjatSection').within(() => {
    selectOption('Lukio');

    jatka();
  });
};

const fillDiplomi = () => {
  getByTestId('diplomiTyypit').within(() => {
    selectOption('Musiikin lukiodiplomi');
  });

  getByTestId('diplomiKuvaus').within(() => {
    typeToEditor('Diplomi kuvaus');
  });
};

const fillKielivalikoima = () => {
  getByTestId('A1A2Kielet').within(() => {
    selectOption('englanti');
  });

  getByTestId('B2Kielet').within(() => {
    selectOption('saksa');
  });

  getByTestId('aidinkielet').within(() => {
    selectOption('suomi');
  });

  getByTestId('B1Kielet').within(() => {
    selectOption('ruotsi');
  });

  getByTestId('B3Kielet').within(() => {
    selectOption('espanja');
  });

  getByTestId('muutKielet').within(() => {
    selectOption('kiina');
  });
};

const toteutusOid = '1.2.3.4.5.6';

const prepareTest = tyyppi => {
  const organisaatioOid = '1.1.1.1.1.1';
  const koulutusOid = '1.2.1.1.1.1';

  const testKoulutusFields = {
    oid: koulutusOid,
    organisaatioOid: organisaatioOid,
    koulutusKoodiUri: 'koulutus_0#1',
    tarjoajat: ['1.2.2.1.1.1'],
    tila: 'julkaistu',
  };

  playMocks(toteutusMocks);
  stubToteutusFormRoutes({ organisaatioOid });
  cy.intercept(
    { method: 'GET', url: `**/koulutus/${koulutusOid}` },
    { body: _fp.merge(koulutus({ tyyppi }), testKoulutusFields) }
  );

  cy.intercept(
    { method: 'GET', url: `**/toteutus/${toteutusOid}` },
    { body: [] }
  );

  cy.visit(`/organisaatio/${organisaatioOid}/koulutus/${koulutusOid}/toteutus`);
};

export const createToteutusForm = () => {
  it('should be able to create ammatillinen tutkinnon osa toteutus', () => {
    prepareTest('amm-tutkinnon-osa');

    cy.intercept(
      { method: 'PUT', url: '**/toteutus' },
      {
        body: {
          oid: toteutusOid,
        },
      }
    ).as('createAmmToteutusResponse');

    fillPohjaSection();
    fillKieliversiotSection({ jatka: true });
    fillTiedotSection();

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

    cy.intercept(
      { method: 'PUT', url: '**/toteutus' },
      {
        body: {
          oid: toteutusOid,
        },
      }
    ).as('createAmmToteutusResponse');

    fillPohjaSection();
    fillKieliversiotSection({ jatka: true });
    fillTiedotSection();

    getByTestId('osaamisalatSection').within(() => {
      getByTestId('osaamisalaSelection').within(() => {
        selectCheckbox('Kaivostyön osaamisala');
      });

      getByTestId('osaamisalaToggle.osaamisala_1800').click({ force: true });
      cy.findByLabelText('yleiset.linkki').pipe(paste('http://linkki.com'));
      cy.findByLabelText('yleiset.linkinOtsikko').pipe(
        paste('osaamisala_0 otsikko')
      );

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

    cy.intercept(
      { method: 'PUT', url: '**/toteutus' },
      {
        body: {
          oid: toteutusOid,
        },
      }
    ).as('createYoToteutusResponse');

    fillPohjaSection();
    fillKieliversiotSection({ jatka: true });
    fillTiedotSection();

    // NOTE: Korkeakoulu osaamisalat hidden for now (KTO-286, KTO-1175)
    /*
    getByTestId('alemmanKorkeakoulututkinnonOsaamisalatSection').within(() => {
      fillKkOsaamisalat();
      jatka();
    });

    getByTestId('ylemmanKorkeakoulututkinnonOsaamisalatSection').within(() => {
      fillKkOsaamisalat();
      jatka();
    });
    */

    getByTestId('jarjestamistiedotSection').within(() => {
      fillCommonJarjestamistiedot({
        maksullisuusTyyppi: MaksullisuusTyyppi.LUKUVUOSIMAKSU,
      });
      cy.findByTestId('apuraha').should('not.exist');
      fillOpetuskieli('englanti'); // "englanti" is needed for apuraha selection to show up
      cy.findByTestId('apuraha').should('exist');
      fillApuraha();
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

    cy.intercept(
      { method: 'PUT', url: '**/toteutus' },
      {
        body: {
          oid: toteutusOid,
        },
      }
    ).as('createLkToteutusResponse');

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
