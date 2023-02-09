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
  withinSection,
  getInputByLabel,
  getSelectByLabel,
  pFillSelect,
  fillPohjaSectionCopyingValuesFrom,
  tilaShouldBe,
  fillOrgSection,
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

const fillJarjestamistiedotWithApuraha = () => {
  withinSection('jarjestamistiedot', () => {
    fillCommonJarjestamistiedot({
      maksullisuusTyyppi: MaksullisuusTyyppi.LUKUVUOSIMAKSU,
    });
    cy.findByTestId('apuraha').should('not.exist');
    fillOpetuskieli('englanti'); // "englanti" is needed for apuraha selection to show up
    cy.findByTestId('apuraha').should('exist');
    fillApuraha();
  });
};

const fillNayttamistiedotSection = (
  { ammattinimikkeet } = { ammattinimikkeet: true }
) => {
  withinSection('nayttamistiedot', () => {
    if (ammattinimikkeet) {
      getByTestId('ammattinimikkeetSelect').within(() => {
        fillAsyncSelect('ammattinimike', 'yleiset.luoKohde');
      });
    }

    getByTestId('avainsanatSelect').within(() => {
      fillAsyncSelect('avainsana', 'yleiset.luoKohde');
    });
  });
};

const fillJarjestajatSection = () => {
  withinSection('tarjoajat', () => {
    getByTestId('jarjestamispaikatSelection').within(() => {
      fillTreeSelect(['1.2.2.1.1.1']);
    });
  });
};

const fillTiedotSection = tyyppi => {
  withinSection('tiedot', () => {
    if (
      ['yo', 'amk', 'amm-ope-erityisope-ja-opo', 'kk-opintojakso'].includes(
        tyyppi
      )
    ) {
      getByTestId('toteutuksenNimi')
        .find('input')
        .clear()
        .pipe(paste('toteutuksen nimi'));
    }
  });
};

const fillKkOpintokokonaisuusTiedotSection = () => {
  withinSection('tiedot', () => {
    getByTestId('toteutuksenNimi')
      .find('input')
      .clear()
      .pipe(paste('toteutuksen nimi'));

    getByTestId('laajuusnumero').pipe(paste('10'));

    cy.findByLabelText(/laajuusyksikko/)
      .should('be.disabled')
      .should('have.value', 'opintopistettä');

    getInputByLabel('yleiset.tunniste').pipe(paste('ABC-123'));

    getSelectByLabel('yleiset.opinnonTyyppi').pipe(pFillSelect('Aineopinnot'));

    selectCheckbox(/isAvoinKorkeakoulutus/);
  });
};

const fillLukioTiedotSection = () => {
  withinSection('tiedot', () => {
    selectCheckbox(/jotpaRahoitus/);
  });
};

const fillTuvaTiedotSection = () => {
  withinSection('tiedot', () => {
    cy.findByLabelText(/toteutuksenNimi/)
      .should('be.disabled')
      .should('have.value', 'Tutkintokoulutukseen valmentava koulutus (TUVA)');

    cy.findByLabelText(/toteutuslomake.laajuus/)
      .should('be.disabled')
      .should('have.value', '38 viikkoa');

    cy.findByRole('textbox', { name: 'toteutuslomake.aloituspaikat' })
      .clear()
      .pipe(paste('25'));
  });
};

const fillVapaaSivistystyoOpistovuosiTiedotSection = () => {
  withinSection('tiedot', () => {
    getInputByLabel('toteutuslomake.toteutuksenNimi').should('be.disabled');

    getInputByLabel('toteutuslomake.laajuus')
      .should('be.disabled')
      .should('have.value', 'vähintään 53 op');
  });
};

const fillVapaaSivistystyoMuuTiedotSection = () => {
  withinSection('tiedot', () => {
    getInputByLabel('toteutuslomake.toteutuksenNimi').should('not.be.disabled');

    getInputByLabel('toteutuslomake.laajuus')
      .should('be.disabled')
      .should('have.value', 'vähintään 53 op');
  });
};

const fillAmmMuuTiedotSection = () => {
  withinSection('tiedot', () => {
    getInputByLabel('toteutuslomake.toteutuksenNimi')
      .should('not.be.disabled')
      .should('have.value', 'Muut ammatilliset koulutukset');

    getInputByLabel('toteutuslomake.laajuus')
      .should('be.disabled')
      .should('have.value', '12 osaamispistettä');
  });
};

const fillTelmaTiedotSection = () => {
  withinSection('tiedot', () => {
    cy.findByLabelText(/toteutuksenNimi/)
      .should('be.disabled')
      .should(
        'have.value',
        'Työhön ja itsenäiseen elämään valmentava koulutus (TELMA)'
      );

    cy.findByLabelText(/toteutuslomake.laajuus/)
      .should('be.disabled')
      .should('have.value', '60 osaamispistettä');

    cy.findByRole('textbox', { name: 'toteutuslomake.aloituspaikat' })
      .clear()
      .pipe(paste('25'));
  });
};

const fillEBTiedotSection = () => {
  withinSection('tiedot', () => {
    cy.findByLabelText(/toteutuksenNimi/)
      .should('not.be.disabled')
      .should('have.value', 'EB-tutkinto (European Baccalaureate)');
  });
};

const fillAikuistenPerusopetusTiedotSection = () => {
  withinSection('tiedot', () => {
    cy.findByLabelText(/toteutuksenNimi/)
      .should('not.be.disabled')
      .should('have.value', 'Aikuisten perusopetus');

    cy.findByLabelText(/toteutuslomake.laajuus/)
      .should('be.disabled')
      .should('have.value', '13 opintopistettä');

    cy.findByRole('textbox', { name: 'toteutuslomake.aloituspaikat' })
      .clear()
      .pipe(paste('25'));
  });
};

const fillDIATiedotSection = () => {
  withinSection('tiedot', () => {
    cy.findByLabelText(/toteutuksenNimi/)
      .should('not.be.disabled')
      .should('have.value', 'Deutsche Internationale Abitur; Reifeprüfung');
    selectCheckbox(/jotpaRahoitus/);
  });
};

const fillTaiteenPerusopetusTiedotSection = () => {
  withinSection('tiedot', () => {
    getByTestId('toteutuksenNimi')
      .find('input')
      .clear()
      .pipe(paste('toteutuksen nimi'));

    getRadio('range').click({ force: true });
    getByTestId('laajuusMin').find('input').pipe(paste('10'));
    getByTestId('laajuusMax').find('input').pipe(paste('20'));

    getByTestId('laajuusyksikko').pipe(pFillSelect('opintopistettä'));
    getByTestId('taiteenalatSelect').within(() => {
      fillAsyncSelect('Sirkustaide');
      fillAsyncSelect('Sanataide');
    });
  });
};

const fillYhteystiedotSection = () => {
  withinSection('yhteyshenkilot', () => {
    fillYhteyshenkilotFields();
  });
};

const fillLukiolinjatSection = () => {
  withinSection('lukiolinjat', () => {
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
  withinSection('kuvaus', () => {
    getByTestId('toteutuksenKuvaus').within(() => {
      typeToEditor('Toteutuksen kuvaus');
    });
  });
};

const fillLiitetytOpintojaksotSection = () => {
  withinSection('opintojaksojenLiittaminen', () => {
    cy.findByRole('button', {
      name: /toteutuslomake\.lisaaOpintojakso/,
    }).click();

    getByTestId('opintojakso-0').within(() => {
      selectOption('Testitoteutus 1');
    });

    cy.findByRole('button', {
      name: /toteutuslomake\.lisaaOpintojakso/,
    }).click();

    getByTestId('opintojakso-1').within(() => {
      selectOption('Testitoteutus 2');
    });

    getByTestId('opintojakso-0').within(() => {
      cy.findByRole('button', { name: /yleiset\.poistaRivi/ }).click();
    });

    cy.findAllByTestId(/^opintojakso-\d?$/).should('have.length', 1);
  });
};

const fillHakeutumisTaiIlmoittautumistapaSection = () => {
  withinSection('hakeutumisTaiIlmoittautumistapa', () => {
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

  if (tyyppi === 'lk' || tyyppi === 'dia' || tyyppi === 'eb') {
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
});

export const createToteutusForm = () => {
  const organisaatioOid = '1.1.1.1.1.1';

  it(
    'should be able to create ammatillinen tutkinnon osa toteutus',
    mutationTest(() => {
      prepareTest('amm-tutkinnon-osa');

      fillOrgSection(organisaatioOid);
      fillPohjaSection();
      fillKieliversiotSection();
      fillTiedotSection('amm-tutkinnon-osa');

      fillKuvausSection();

      withinSection('jarjestamistiedot', () => {
        fillCommonJarjestamistiedot();
      });

      fillNayttamistiedotSection({ ammattinimikkeet: false });
      fillJarjestajatSection();

      cy.findByTestId('soraKuvausSection').should('not.exist');

      fillHakeutumisTaiIlmoittautumistapaSection();

      fillYhteystiedotSection();
      fillTilaSection();

      tallenna();
    })
  );

  it(
    'should be able to create ammatillinen toteutus',
    mutationTest(() => {
      prepareTest('amm');

      fillOrgSection(organisaatioOid);
      fillPohjaSection();
      fillKieliversiotSection();
      fillTiedotSection('amm');

      fillKuvausSection();

      withinSection('osaamisalat', () => {
        getByTestId('osaamisalaSelection').within(() => {
          selectCheckbox('Kaivostyön osaamisala');
        });

        getByTestId('osaamisalaToggle.osaamisala_1800').click({ force: true });
        cy.findByLabelText('yleiset.linkki').pipe(paste('http://linkki.com'));
        cy.findByLabelText('yleiset.linkinOtsikko').pipe(
          paste('osaamisala_0 otsikko')
        );
      });

      withinSection('jarjestamistiedot', () => {
        fillCommonJarjestamistiedot();
      });

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

      fillOrgSection(organisaatioOid);
      fillPohjaSection();
      fillKieliversiotSection();
      fillTiedotSection('yo');
      fillKuvausSection();
      fillJarjestamistiedotWithApuraha();
      fillNayttamistiedotSection();
      fillJarjestajatSection();
      fillYhteystiedotSection();
      fillTilaSection();

      tallenna();
    })
  );

  it(
    'should be able to create amm. ope-, erityisope- ja opokoulutuksen toteutus',
    mutationTest(() => {
      prepareTest('amm-ope-erityisope-ja-opo');

      fillOrgSection(organisaatioOid);
      fillPohjaSection();
      fillKieliversiotSection();
      fillTiedotSection('amm-ope-erityisope-ja-opo');
      fillKuvausSection();
      fillJarjestamistiedotWithApuraha();
      fillNayttamistiedotSection();
      fillJarjestajatSection();
      fillYhteystiedotSection();
      fillTilaSection();

      tallenna();
    })
  );

  it(
    'should be able to create korkeakoulutus opintojakso toteutus',
    mutationTest(() => {
      prepareTest('kk-opintojakso');

      fillOrgSection(organisaatioOid);
      fillPohjaSection();
      fillKieliversiotSection();
      fillTiedotSection('kk-opintojakso');
      fillKuvausSection();

      fillJarjestamistiedotWithApuraha();
      fillNayttamistiedotSection({ ammattinimikkeet: false });
      fillJarjestajatSection();
      fillHakeutumisTaiIlmoittautumistapaSection();
      fillYhteystiedotSection();
      fillTilaSection();

      tallenna();
    })
  );

  it(
    'should be able to create korkeakoulutus opintokokonaisuustoteutus',
    mutationTest(() => {
      prepareTest('kk-opintokokonaisuus');

      fillOrgSection(organisaatioOid);
      fillPohjaSection();
      fillKieliversiotSection();
      fillKkOpintokokonaisuusTiedotSection();
      fillKuvausSection();
      fillLiitetytOpintojaksotSection();
      fillJarjestamistiedotWithApuraha();
      fillNayttamistiedotSection({ ammattinimikkeet: false });
      fillJarjestajatSection();
      fillHakeutumisTaiIlmoittautumistapaSection();
      fillYhteystiedotSection();
      fillTilaSection();

      tallenna();
    })
  );

  it(
    'should be able to create lukio toteutus',
    mutationTest(() => {
      prepareTest('lk');

      fillOrgSection(organisaatioOid);
      fillPohjaSection();
      fillKieliversiotSection();
      fillLukioTiedotSection();

      fillKuvausSection();

      fillLukiolinjatSection();

      withinSection('jarjestamistiedot', () => {
        fillCommonJarjestamistiedot();
        fillKielivalikoima();
        fillDiplomi();
      });

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

      fillOrgSection(organisaatioOid);
      fillPohjaSection();
      fillKieliversiotSection();
      fillTuvaTiedotSection();

      fillKuvausSection();

      withinSection('jarjestamistiedot', () => {
        fillCommonJarjestamistiedot();
      });

      fillNayttamistiedotSection({ ammattinimikkeet: false });
      fillJarjestajatSection();
      fillYhteystiedotSection();
      fillTilaSection();

      tallenna();
    })
  );

  it(
    'should be able to create "Vapaa Sivistystyö  - Opistovuosi" toteutus',
    mutationTest(() => {
      prepareTest('vapaa-sivistystyo-opistovuosi');

      fillOrgSection(organisaatioOid);
      fillPohjaSection();
      fillKieliversiotSection();
      fillVapaaSivistystyoOpistovuosiTiedotSection();

      fillKuvausSection();

      withinSection('jarjestamistiedot', () => {
        fillCommonJarjestamistiedot();
      });

      fillNayttamistiedotSection({ ammattinimikkeet: false });
      fillJarjestajatSection();
      fillYhteystiedotSection();
      fillTilaSection();

      tallenna();
    })
  );

  it(
    'should be able to create "Vapaa Sivistystyö - Muu" toteutus',
    mutationTest(() => {
      prepareTest('vapaa-sivistystyo-muu');

      fillOrgSection(organisaatioOid);
      fillPohjaSection();
      fillKieliversiotSection();
      fillVapaaSivistystyoMuuTiedotSection();

      fillKuvausSection();

      withinSection('jarjestamistiedot', () => {
        fillCommonJarjestamistiedot();
      });

      fillNayttamistiedotSection({ ammattinimikkeet: false });
      fillJarjestajatSection();
      fillHakeutumisTaiIlmoittautumistapaSection();
      fillYhteystiedotSection();
      fillTilaSection();

      tallenna();
    })
  );

  it(
    'should be able to create TELMA toteutus',
    mutationTest(() => {
      prepareTest('telma');

      fillOrgSection(organisaatioOid);
      fillPohjaSection();
      fillKieliversiotSection();
      fillTelmaTiedotSection();

      fillKuvausSection();

      withinSection('jarjestamistiedot', () => {
        fillCommonJarjestamistiedot();
      });

      fillNayttamistiedotSection({ ammattinimikkeet: false });
      fillJarjestajatSection();
      fillYhteystiedotSection();
      fillTilaSection();

      tallenna();
    })
  );

  it(
    'should be able to create muu ammatillinen toteutus',
    mutationTest(() => {
      prepareTest('amm-muu');

      fillOrgSection(organisaatioOid);
      fillPohjaSection();
      fillKieliversiotSection();
      fillAmmMuuTiedotSection();

      fillKuvausSection();

      withinSection('jarjestamistiedot', () => {
        fillCommonJarjestamistiedot();
      });

      fillNayttamistiedotSection({ ammattinimikkeet: false });
      fillJarjestajatSection();
      fillHakeutumisTaiIlmoittautumistapaSection();
      fillYhteystiedotSection();
      fillTilaSection();

      tallenna();
    })
  );

  it(
    'should be able to create "Aikuisten perusopetus" -toteutus',
    mutationTest(() => {
      prepareTest('aikuisten-perusopetus');

      fillOrgSection(organisaatioOid);
      fillPohjaSection();
      fillKieliversiotSection();
      fillAikuistenPerusopetusTiedotSection();

      fillKuvausSection();

      withinSection('jarjestamistiedot', () => {
        fillCommonJarjestamistiedot();
      });

      fillNayttamistiedotSection({ ammattinimikkeet: false });
      fillJarjestajatSection();
      fillHakeutumisTaiIlmoittautumistapaSection();
      fillYhteystiedotSection();
      fillTilaSection();

      tallenna();
    })
  );

  it(
    'should be able to create "DIA" -toteutus',
    mutationTest(() => {
      prepareTest('dia');

      fillOrgSection(organisaatioOid);
      fillPohjaSection();
      fillKieliversiotSection();
      fillDIATiedotSection();

      fillKuvausSection();

      withinSection('jarjestamistiedot', () => {
        fillCommonJarjestamistiedot();
        fillKielivalikoima();
        fillDiplomi();
      });

      fillNayttamistiedotSection({ ammattinimikkeet: false });
      fillJarjestajatSection();
      fillYhteystiedotSection();
      fillTilaSection();

      tallenna();
    })
  );

  it(
    'should be able to create "EB" -toteutus',
    mutationTest(() => {
      prepareTest('eb');

      fillOrgSection(organisaatioOid);
      fillPohjaSection();
      fillKieliversiotSection();
      fillEBTiedotSection();

      fillKuvausSection();

      withinSection('jarjestamistiedot', () => {
        fillCommonJarjestamistiedot();
        fillKielivalikoima();
        fillDiplomi();
      });

      fillNayttamistiedotSection({ ammattinimikkeet: false });
      fillJarjestajatSection();
      fillYhteystiedotSection();
      fillTilaSection();

      tallenna();
    })
  );

  it(
    'should be able to create "Taiteen perusopetus" -toteutus',
    mutationTest(() => {
      prepareTest('taiteen-perusopetus');

      fillPohjaSection();
      fillOrgSection(organisaatioOid);
      fillKieliversiotSection();
      fillTaiteenPerusopetusTiedotSection();

      fillKuvausSection();

      withinSection('jarjestamistiedot', () => {
        fillCommonJarjestamistiedot();
      });

      fillNayttamistiedotSection({ ammattinimikkeet: false });
      fillJarjestajatSection();
      fillHakeutumisTaiIlmoittautumistapaSection();
      fillYhteystiedotSection();
      fillTilaSection();

      tallenna();
    })
  );

  it('using an existing object as baseline it should not copy publishing state', () => {
    prepareTest('yo');
    fillPohjaSectionCopyingValuesFrom('Testitoteutus 1');
    tilaShouldBe('tallennettu');
  });
};
