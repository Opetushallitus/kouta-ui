import { playMocks } from 'kto-ui-common/cypress/mockUtils';

import { stubKoulutusFormRoutes } from '#/cypress/koulutusFormUtils';
import koulutusMocks from '#/cypress/mocks/koulutus.mocks.json';
import {
  getSelectOption,
  getCheckbox,
  selectOption,
  fillTreeSelect,
  fillAsyncSelect,
  getByTestId,
  paste,
  fillKieliversiotSection,
  fillPohjaSection,
  fillTilaSection,
  tallenna,
  fillKoulutustyyppiSection,
  typeToEditor,
  wrapMutationTest,
  withinSection,
  getSelectByLabel,
  pFillSelect,
  getInputByLabel,
  pFillAsyncSelect,
} from '#/cypress/utils';
import { ENTITY } from '#/src/constants';

const fillLisatiedotSection = () => {
  withinSection('lisatiedot', () => {
    getByTestId('osiotSelect').click();

    getByTestId('osiotSelect').within(() => {
      getSelectOption('Opintojen rakenne').click({
        force: true,
      });
    });

    getByTestId('osioKuvaus.koulutuksenlisatiedot_01#1').within(() => {
      typeToEditor('koulutuksenlisatiedot kuvaus');
    });
  });
};

const fillSoraKuvausSection = () => {
  withinSection('soraKuvaus', () => {
    selectOption('Sora-kuvaus 1');
  });
};

const fillJarjestajaSection = () => {
  withinSection('tarjoajat', () => {
    getByTestId('jarjestajatSelection').within(() => {
      fillTreeSelect(['1.2.1.1.1.1']);
    });
  });
};

const fillCommon = ({ koulutustyyppiPath }) => {
  fillKoulutustyyppiSection(koulutustyyppiPath);
  fillPohjaSection();
  fillKieliversiotSection({ jatka: true });
};

const fillNakyvyysSection = () => {
  withinSection('julkinen', () => {
    getCheckbox(null).click({ force: true });
  });
};

export const createKoulutusForm = () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const koulutusOid = '1.2.3.4.5';
  beforeEach(() => {
    stubKoulutusFormRoutes({ organisaatioOid });
    playMocks(koulutusMocks);

    cy.visit(`/organisaatio/${organisaatioOid}/koulutus`);
  });

  const mutationTest = wrapMutationTest({
    oid: koulutusOid,
    entity: ENTITY.KOULUTUS,
  });

  it(
    'should be able to create ammatillinen koulutus',
    mutationTest(() => {
      fillCommon({ koulutustyyppiPath: ['amm'] });

      withinSection('information', () => {
        getByTestId('koulutusSelect').click();

        getByTestId('koulutusSelect').within(() => {
          fillAsyncSelect('Kaivosalan perustutkinto');
        });

        getByTestId('ePerusteSelect').within(() => {
          fillAsyncSelect('Kaivosalan perustutkinto');
        });
      });

      fillLisatiedotSection();

      fillSoraKuvausSection();

      fillJarjestajaSection();

      fillNakyvyysSection();

      fillTilaSection();

      tallenna();
    })
  );

  it(
    'should be able to create ammatillinen osaamisala koulutus',
    mutationTest(() => {
      fillCommon({ koulutustyyppiPath: ['ammatillinen', 'amm-osaamisala'] });

      withinSection('osaamisala', () => {
        getByTestId('koulutusSelect').click();

        getByTestId('koulutusSelect').within(() => {
          fillAsyncSelect('Kaivosalan perustutkinto');
        });

        getByTestId('ePerusteSelect').within(() => {
          fillAsyncSelect('Kaivosalan perustutkinto');
        });

        getByTestId('osaamisalaSelect').within(() => {
          fillAsyncSelect('Kaivostyön osaamisala');
        });

        cy.findByRole('link', { name: '1800' }).should($link => {
          const url = new URL($link.attr('href'));
          expect(url.pathname).to.equal('/');
          expect(url.hash).to.equal(
            '#/fi/esitys/6777660/reformi/sisalto/6858226'
          );
        });
      });

      fillLisatiedotSection();

      fillSoraKuvausSection();

      fillJarjestajaSection();

      fillNakyvyysSection();

      fillTilaSection();

      tallenna();
    })
  );

  it(
    'should be able to create ammatillinen tutkinnon osa koulutus',
    mutationTest(() => {
      fillCommon({ koulutustyyppiPath: ['ammatillinen', 'amm-tutkinnon-osa'] });

      withinSection('tutkinnonosat', () => {
        getByTestId('lisaaKoulutusButton').click();

        getSelectByLabel('yleiset.valitseKoulutus').pipe(
          pFillAsyncSelect('Kaivosalan perustutkinto')
        );

        getByTestId('ePerusteSelect').within(() => {
          fillAsyncSelect('Kaivosalan perustutkinto');
        });

        getByTestId('tutkinnonOsatSelect').within(() => {
          fillAsyncSelect('Louhintaporaus');
        });

        cy.findByRole('link', { name: '106436' }).should($link => {
          const url = new URL($link.attr('href'));
          expect(url.pathname).to.equal('/');
          expect(url.hash).to.equal(
            '#/fi/esitys/6777660/reformi/tutkinnonosat/6778201'
          );
        });
      });

      withinSection('nimi', () => {
        getInputByLabel('koulutuslomake.lisaaKoulutuksenNimi').should(
          'have.value',
          'Louhintaporaus'
        );
      });

      withinSection('tutkinnonosat', () => {
        getByTestId('tutkinnonOsatSelect').within(() => {
          fillAsyncSelect('Kaivosmittaus');
        });

        cy.findByRole('link', { name: '106442' }).should($link => {
          const url = new URL($link.attr('href'));
          expect(url.pathname).to.equal('/');
          expect(url.hash).to.equal(
            '#/fi/esitys/6777660/reformi/tutkinnonosat/6778207'
          );
        });
      });

      fillLisatiedotSection();

      fillSoraKuvausSection();

      fillJarjestajaSection();

      fillNakyvyysSection();

      fillTilaSection();

      tallenna();
    })
  );

  it(
    'should be able to create AMK-koulutus',
    mutationTest(() => {
      fillCommon({ koulutustyyppiPath: ['korkeakoulutus', 'amk'] });

      withinSection('information', () => {
        getSelectByLabel('yleiset.valitseKoulutukset').pipe(
          pFillAsyncSelect('Fysioterapeutti (AMK)')
        );

        getSelectByLabel('koulutuslomake.valitseOpintojenLaajuus').pipe(
          pFillSelect('300')
        );

        getSelectByLabel('koulutuslomake.valitseTutkintonimike').pipe(
          pFillAsyncSelect('Fysioterapeutti (AMK)')
        );

        getSelectByLabel('koulutuslomake.valitseKoulutusalat').pipe(
          pFillAsyncSelect('Terveys')
        );

        getInputByLabel('koulutuslomake.muokkaaKoulutuksenNimea').pipe(
          paste('Tiedot nimi')
        );
      });

      withinSection('description', () => {
        getInputByLabel('yleiset.kuvauksenNimi').pipe(paste('Kuvauksen nimi'));

        getInputByLabel('yleiset.kuvaus').pipe(paste('Kuvaus'));
      });

      fillLisatiedotSection();

      fillSoraKuvausSection();

      fillJarjestajaSection();

      fillTilaSection();

      tallenna();
    })
  );

  it(
    'should be able to create korkeakoulutus opintojakso koulutus',
    mutationTest(() => {
      fillCommon({
        koulutustyyppiPath: ['korkeakoulutus', 'kk-opintojakso'],
      });

      withinSection('information', () => {
        getByTestId('laajuusnumero').pipe(paste('30'));

        getSelectByLabel('yleiset.laajuusyksikko').pipe(
          pFillSelect('opintopistettä')
        );

        getSelectByLabel('koulutuslomake.valitseKoulutusalat').pipe(
          pFillAsyncSelect('Terveys')
        );

        getInputByLabel('koulutuslomake.koulutuksenNimi').pipe(
          paste('Opintojakso nimi')
        );
      });

      withinSection('description', () => {
        getInputByLabel('yleiset.kuvauksenNimi').pipe(paste('Kuvauksen nimi'));

        getInputByLabel('yleiset.kuvaus').pipe(paste('Kuvaus'));
      });

      fillLisatiedotSection();

      fillJarjestajaSection();

      fillTilaSection();

      tallenna();
    })
  );

  it(
    'should be able to create Ammatillinen opettaja- erityisopettaja ja opokoulutus',
    mutationTest(() => {
      fillCommon({
        koulutustyyppiPath: ['korkeakoulutus', 'amm-ope-erityisope-ja-opo'],
      });

      withinSection('information', () => {
        getSelectByLabel('yleiset.valitseKoulutus').pipe(
          pFillAsyncSelect('Ammatillinen opettajankoulutus')
        );

        getInputByLabel('koulutuslomake.valitseOpintojenLaajuus')
          .should('be.disabled')
          .should('have.value', '60 opintopistettä');

        getInputByLabel('koulutuslomake.valitseTutkintonimike')
          .should('be.disabled')
          .should('have.value', 'koulutuslomake.eiTutkintonimiketta');

        getSelectByLabel('koulutuslomake.valitseKoulutusalat').should(
          'have.text',
          'kansallinenkoulutusluokitus2016koulutusalataso1_01#1'
        );

        getInputByLabel('koulutuslomake.muokkaaKoulutuksenNimea').should(
          'have.value',
          'Ammatillinen opettajankoulutus'
        );
      });

      withinSection('description', () => {
        getInputByLabel('yleiset.kuvauksenNimi').pipe(paste('Kuvauksen nimi'));

        getInputByLabel('yleiset.kuvaus').pipe(paste('Kuvaus'));
      });

      fillLisatiedotSection();

      fillSoraKuvausSection();

      fillJarjestajaSection();

      fillTilaSection();

      tallenna();
    })
  );

  it(
    'should be able to create lukiokoulutus',
    mutationTest(() => {
      fillCommon({ koulutustyyppiPath: ['lk'] });

      withinSection('information', () => {
        getSelectByLabel('yleiset.valitseKoulutus').pipe(
          pFillAsyncSelect('Ylioppilastutkinto')
        );
      });

      withinSection('description', () => {
        getInputByLabel('yleiset.kuvaus').pipe(paste('Kuvaus'));
      });

      fillLisatiedotSection();

      fillSoraKuvausSection();

      fillJarjestajaSection();

      fillTilaSection();

      tallenna();
    })
  );

  it(
    'should be able to create TUVA-koulutus',
    mutationTest(() => {
      fillCommon({ koulutustyyppiPath: ['tuva'] });

      withinSection('information', () => {
        getSelectByLabel('koulutuslomake.valitseOpintojenLaajuus').pipe(
          pFillSelect('38 viikkoa')
        );

        getInputByLabel('koulutuslomake.koulutuksenNimi').should(
          'have.value',
          'koulutustyypit.tuva'
        );
      });

      withinSection('description', () => {
        getInputByLabel('koulutuslomake.kuvauksenNimi').should('not.exist');

        getInputByLabel('yleiset.kuvaus').pipe(paste('Kuvaus'));

        getInputByLabel('koulutuslomake.linkkiEPerusteisiin').pipe(
          paste('http://linkki.fi')
        );
      });

      fillJarjestajaSection();

      fillTilaSection();

      getByTestId('soraKuvausSection').should('not.exist');
      getByTestId('lisatiedotSection').should('not.exist');

      tallenna();
    })
  );

  it(
    'should be able to create "Vapaa Sivistystyö - Opistovuosi"-koulutus',
    mutationTest(() => {
      fillCommon({
        koulutustyyppiPath: [
          'vapaa-sivistystyo',
          'vapaa-sivistystyo-opistovuosi',
        ],
      });

      withinSection('information', () => {
        getSelectByLabel('koulutuslomake.valitseOpintojenLaajuus').pipe(
          pFillSelect('Vähintään 53 op')
        );

        getInputByLabel('koulutuslomake.koulutuksenNimi').pipe(
          paste('vapaa sivistystyö nimi')
        );
      });

      withinSection('description', () => {
        getInputByLabel('koulutuslomake.kuvauksenNimi').should('not.exist');

        getInputByLabel('yleiset.kuvaus').pipe(paste('Kuvaus'));

        getInputByLabel('koulutuslomake.linkkiEPerusteisiin').pipe(
          paste('http://linkki.fi')
        );
      });

      fillJarjestajaSection();

      fillTilaSection();

      getByTestId('soraKuvausSection').should('not.exist');
      getByTestId('lisatiedotSection').should('not.exist');

      tallenna();
    })
  );

  it(
    'should be able to create "Vapaa Sivistystyö - Muu"-koulutus',
    mutationTest(() => {
      fillCommon({
        koulutustyyppiPath: ['vapaa-sivistystyo', 'vapaa-sivistystyo-muu'],
      });

      withinSection('information', () => {
        getSelectByLabel('koulutuslomake.valitseOpintojenLaajuus').pipe(
          pFillSelect('Vähintään 53 op')
        );

        getInputByLabel('koulutuslomake.koulutuksenNimi').pipe(
          paste('vapaa sivistystyö nimi')
        );
      });

      withinSection('description', () => {
        getInputByLabel('koulutuslomake.kuvauksenNimi').should('not.exist');

        getInputByLabel('yleiset.kuvaus').pipe(paste('Kuvaus'));

        getInputByLabel('koulutuslomake.linkkiEPerusteisiin').pipe(
          paste('http://linkki.fi')
        );
      });

      fillJarjestajaSection();

      fillTilaSection();

      getByTestId('soraKuvausSection').should('not.exist');
      getByTestId('lisatiedotSection').should('not.exist');

      tallenna();
    })
  );

  it(
    'should be able to create TELMA-koulutus',
    mutationTest(() => {
      fillCommon({ koulutustyyppiPath: ['ammatillinen', 'telma'] });

      withinSection('information', () => {
        getSelectByLabel('koulutuslomake.valitseOpintojenLaajuus').pipe(
          pFillSelect('60')
        );

        getInputByLabel('koulutuslomake.koulutuksenNimi').should(
          'have.value',
          'koulutustyypit.telma'
        );
      });

      withinSection('description', () => {
        getInputByLabel('koulutuslomake.kuvauksenNimi').should('not.exist');

        getInputByLabel('yleiset.kuvaus').pipe(paste('Kuvaus'));

        getInputByLabel('koulutuslomake.linkkiEPerusteisiin').pipe(
          paste('http://linkki.fi')
        );
      });

      fillJarjestajaSection();

      fillNakyvyysSection();

      fillTilaSection();

      getByTestId('soraKuvausSection').should('not.exist');
      getByTestId('lisatiedotSection').should('not.exist');

      tallenna();
    })
  );

  it(
    'should be able to create muu ammatillinen koulutus',
    mutationTest(() => {
      fillCommon({ koulutustyyppiPath: ['ammatillinen', 'amm-muu'] });

      withinSection('information', () => {
        getSelectByLabel('yleiset.laajuusyksikko').pipe(
          pFillSelect('osaamispistettä')
        );

        getByTestId('laajuusnumero').pipe(paste('12'));

        getInputByLabel('koulutuslomake.koulutuksenNimi').pipe(
          paste('muu ammatillinen nimi')
        );
      });

      withinSection('description', () => {
        getInputByLabel('koulutuslomake.kuvauksenNimi').should('not.exist');

        getInputByLabel('yleiset.kuvaus').pipe(paste('Kuvaus'));
      });

      fillJarjestajaSection();

      fillTilaSection();

      getByTestId('linkkiEPerusteisiinInput').should('not.exist');
      getByTestId('soraKuvausSection').should('not.exist');
      getByTestId('lisatiedotSection').should('not.exist');

      tallenna();
    })
  );

  it(
    'should be able to create "Aikuisten perusopetus" -koulutus',
    mutationTest(() => {
      fillCommon({ koulutustyyppiPath: ['aikuisten-perusopetus'] });

      withinSection('information', () => {
        getSelectByLabel('yleiset.laajuusyksikko').pipe(
          pFillSelect('opintopistettä')
        );

        getByTestId('laajuusnumero').pipe(paste('13'));

        getInputByLabel('koulutuslomake.koulutuksenNimi').should(
          'have.value',
          'koulutustyypit.aikuistenPerusopetus'
        );
      });

      withinSection('description', () => {
        getInputByLabel('koulutuslomake.kuvauksenNimi').should('not.exist');

        getInputByLabel('yleiset.kuvaus').pipe(paste('Kuvaus'));

        getInputByLabel('koulutuslomake.linkkiEPerusteisiin').pipe(
          paste('http://linkki.fi')
        );
      });

      fillJarjestajaSection();

      fillNakyvyysSection();

      fillTilaSection();

      getByTestId('soraKuvausSection').should('not.exist');
      getByTestId('lisatiedotSection').should('not.exist');

      tallenna();
    })
  );

  it(
    'should be able to create EB-koulutus',
    mutationTest(() => {
      fillCommon({ koulutustyyppiPath: ['lk'] });

      withinSection('information', () => {
        getSelectByLabel('yleiset.valitseKoulutus').pipe(
          pFillAsyncSelect('EB-tutkinto (European Baccalaureate)')
        );

        getSelectByLabel('koulutuslomake.valitseOpintojenLaajuus').pipe(
          pFillSelect('60')
        );

        getSelectByLabel('koulutuslomake.valitseKoulutusalat').should(
          'have.text',
          'Yleissivistävä koulutus'
        );

        getInputByLabel('koulutuslomake.muokkaaKoulutuksenNimea').should(
          'have.value',
          'EB-tutkinto (European Baccalaureate)'
        );
      });

      withinSection('description', () => {
        getInputByLabel('yleiset.kuvaus').pipe(paste('Kuvaus'));
      });

      fillLisatiedotSection();

      fillSoraKuvausSection();

      fillJarjestajaSection();

      fillTilaSection();

      tallenna();
    })
  );
};
