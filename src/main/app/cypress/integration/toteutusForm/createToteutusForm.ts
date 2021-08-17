import { playMocks } from 'kto-ui-common/cypress/mockUtils';
import { merge } from 'lodash/fp';

import koulutus from '#/cypress/data/koulutus';
import lukioMocks from '#/cypress/mocks/lukio.mocks.json';
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
  wrapMutationTest,
} from '#/cypress/utils';
import { Alkamiskausityyppi, ENTITY } from '#/src/constants';
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
  cy.findByLabelText(
    'toteutuslomake.toteutuksellaErillinenAloitusajankohta'
  ).check({ force: true });
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

const fillTiedotSection = tyyppi => {
  getByTestId('tiedotSection').within(() => {
    if (['yo', 'amk'].includes(tyyppi)) {
      getByTestId('toteutuksenNimi')
        .find('input')
        .clear()
        .pipe(paste('toteutuksen nimi'));
    }
    getByTestId('toteutuksenKuvaus').within(() => {
      typeToEditor('Toteutuksen kuvaus');
    });

    jatka();
  });
};

const fillTuvaTiedotSection = () => {
  getByTestId('tiedotSection').within(() => {
    getByTestId('toteutuksenNimi').within(() => {
      cy.get('input').clear().pipe(paste('toteutuksen nimi'));
    });

    cy.findByRole('textbox', { name: 'toteutuslomake.laajuus' })
      .should('be.disabled')
      .should('have.value', '38 viikkoa');

    cy.findByRole('textbox', { name: 'toteutuslomake.aloituspaikat' })
      .clear()
      .pipe(paste('25'));

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
    cy.findByTestId('painotukset').within(() => {
      cy.findByText('toteutuslomake.lukiollaOnPainotuksia').click();
      fillAsyncSelect('Lukion IB-linja');
      fillAsyncSelect('Lukion ICT-linja');

      cy.findByRole('button', {
        name: /^Lukion IB-linja/,
      }).click();

      cy.findByLabelText(/^Lukion IB-linja/).within(() => {
        typeToEditor('IB-linja painotus kuvaus');
      });

      cy.findByRole('button', {
        name: /^Lukion ICT-linja/,
      }).click();

      cy.findByLabelText(/^Lukion ICT-linja/).within(() => {
        typeToEditor('ICT-linja painotus kuvaus');
      });
    });
    cy.findByTestId('erityisetKoulutustehtavat').within(() => {
      cy.findByText(
        'toteutuslomake.lukiollaOnErityisiaKoulutustehtavia'
      ).click();
      fillAsyncSelect('Lukion IB-linja');
      fillAsyncSelect('Lukion ICT-linja');

      cy.findByRole('button', {
        name: /^Lukion IB-linja/,
      }).click();

      cy.findByLabelText(/^Lukion IB-linja/).within(() => {
        typeToEditor('IB-linja erityistehtävä kuvaus');
      });

      cy.findByRole('button', {
        name: /^Lukion ICT-linja/,
      }).click();

      cy.findByLabelText(/^Lukion ICT-linja/).within(() => {
        typeToEditor('ICT-linja erityistehtävä kuvaus');
      });
    });
    jatka();
  });
};

const fillDiplomi = () => {
  cy.findByLabelText('toteutuslomake.lukiodiplomi').within(() => {
    fillAsyncSelect('Käsityön lukiodiplomi');
    fillAsyncSelect('Tanssin lukiodiplomi');

    cy.findByRole('button', {
      name: /^Käsityön lukiodiplomi/,
    }).click();
    cy.findByLabelText(/^Käsityön lukiodiplomi/).within(() => {
      cy.findByLabelText('toteutuslomake.linkkiLisatietoihin').pipe(
        paste('http://example.com')
      );
      cy.findByLabelText('toteutuslomake.linkinAltTeksti').pipe(
        paste('Käsityön diplomin lisätietoja')
      );
    });
  });
};

const fillKielivalikoima = () => {
  getByTestId('A1Kielet').within(() => {
    selectOption('englanti');
  });

  getByTestId('A2Kielet').within(() => {
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

const fillKuvausSection = () => {
  getByTestId('kuvausSection').within(() => {
    getByTestId('toteutuksenKuvaus').within(() => {
      typeToEditor('Tuva kuvaus');
    });

    jatka();
  });
};

const fillHakeutumisTaiIlmoittautumistapaSection = () => {
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

  if (tyyppi === 'lk') {
    playMocks(lukioMocks);
  }

  stubToteutusFormRoutes({ organisaatioOid });
  cy.intercept(
    { method: 'GET', url: `**/koulutus/${koulutusOid}` },
    { body: merge(koulutus({ tyyppi }), testKoulutusFields) }
  );

  cy.visit(`/organisaatio/${organisaatioOid}/koulutus/${koulutusOid}/toteutus`);
};

const mutationTest = wrapMutationTest({
  oid: toteutusOid,
  entity: ENTITY.TOTEUTUS,
  stubGet: true,
});

export const createToteutusForm = () => {
  it(
    'should be able to create ammatillinen tutkinnon osa toteutus',
    mutationTest(() => {
      prepareTest('amm-tutkinnon-osa');

      fillPohjaSection();
      fillKieliversiotSection({ jatka: true });
      fillTiedotSection('amm-tutkinnon-osa');

      getByTestId('jarjestamistiedotSection').within(() => {
        fillCommonJarjestamistiedot();
        jatka();
      });

      fillTeemakuvaSection();
      fillNayttamistiedotSection({ ammattinimikkeet: false });
      fillJarjestajatSection();

      cy.findByTestId('soraKuvausSection').should('not.exist');

      fillHakeutumisTaiIlmoittautumistapaSection();

      getByTestId('soraKuvausSection').within(() => {
        jatka();
      });

      fillYhteystiedotSection();
      fillTilaSection();

      tallenna();
    })
  );

  it(
    'should be able to create ammatillinen toteutus',
    mutationTest(() => {
      prepareTest('amm');

      fillPohjaSection();
      fillKieliversiotSection({ jatka: true });
      fillTiedotSection('amm');

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
    })
  );

  it(
    'should be able to create korkeakoulu toteutus',
    mutationTest(() => {
      prepareTest('yo');

      fillPohjaSection();
      fillKieliversiotSection({ jatka: true });
      fillTiedotSection('yo');

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
    })
  );

  it(
    'should be able to create lukio toteutus',
    mutationTest(() => {
      prepareTest('lk');

      fillPohjaSection();
      fillKieliversiotSection({ jatka: true });
      fillTiedotSection('lk');

      fillLukiolinjatSection();

      getByTestId('jarjestamistiedotSection').within(() => {
        fillCommonJarjestamistiedot();
        fillKielivalikoima();
        fillDiplomi();
        jatka();
      });

      fillTeemakuvaSection();
      fillNayttamistiedotSection({ ammattinimikkeet: false });
      fillJarjestajatSection();
      fillYhteystiedotSection();
      fillTilaSection();

      tallenna();
    })
  );

  it(
    'should be able to create TUVA toteutus',
    mutationTest(() => {
      prepareTest('tuva');

      fillPohjaSection();
      fillKieliversiotSection({ jatka: true });
      fillTuvaTiedotSection();

      fillKuvausSection();

      getByTestId('jarjestamistiedotSection').within(() => {
        fillCommonJarjestamistiedot();
        jatka();
      });

      fillTeemakuvaSection();
      fillNayttamistiedotSection({ ammattinimikkeet: false });
      fillJarjestajatSection();
      fillHakeutumisTaiIlmoittautumistapaSection();
      fillYhteystiedotSection();
      fillTilaSection();

      tallenna();
    })
  );
};
