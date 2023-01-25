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
  selectCheckbox,
  fillKoulutustyyppiSection,
  typeToEditor,
  wrapMutationTest,
  withinSection,
  getSelectByLabel,
  pFillSelect,
  getInputByLabel,
  pFillAsyncSelect,
  getRadio,
  fillPohjaSectionCopyingValuesFrom,
  tilaShouldBe,
  fillOrgSection,
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
    getByTestId('tarjoajatSelection').within(() => {
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
      fillOrgSection(organisaatioOid);

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
      fillOrgSection(organisaatioOid);

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
      fillOrgSection(organisaatioOid);

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
      fillOrgSection(organisaatioOid);

      withinSection('information', () => {
        getSelectByLabel('yleiset.valitseKoulutukset').pipe(
          pFillAsyncSelect('Fysioterapeutti (AMK)')
        );

        getByTestId('laajuusnumero').pipe(paste('300'));

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
      fillOrgSection(organisaatioOid);

      withinSection('information', () => {
        getRadio('single').click({ force: true });
        getByTestId('laajuusMin').find('input').pipe(paste('30'));

        getByTestId('forcedLaajuusyksikko')
          .find('input')
          .should('have.value', 'opintopistettä');

        getSelectByLabel('koulutuslomake.valitseKoulutusalat').pipe(
          pFillAsyncSelect('Terveys')
        );

        getInputByLabel('koulutuslomake.koulutuksenNimi').pipe(
          paste('Opintojakso nimi')
        );

        getInputByLabel('yleiset.tunniste').pipe(paste('ABC-123'));

        getSelectByLabel('yleiset.opinnonTyyppi').pipe(
          pFillAsyncSelect('Aineopinnot')
        );

        selectCheckbox(/isAvoinKorkeakoulutus/);
      });

      withinSection('description', () => {
        getInputByLabel('yleiset.kuvaus').pipe(paste('Kuvaus'));
      });

      fillLisatiedotSection();

      fillJarjestajaSection();

      fillTilaSection();

      tallenna();
    })
  );

  it(
    'should be able to create korkeakoulutus opintokokonaisuuskoulutus',
    mutationTest(() => {
      fillCommon({
        koulutustyyppiPath: ['korkeakoulutus', 'kk-opintokokonaisuus'],
      });
      fillOrgSection(organisaatioOid);

      withinSection('information', () => {
        getRadio('range').click({ force: true });
        getByTestId('laajuusMin').find('input').pipe(paste('5'));
        getByTestId('laajuusMax').find('input').pipe(paste('10'));
        getByTestId('forcedLaajuusyksikko')
          .find('input')
          .should('have.value', 'opintopistettä');
        getSelectByLabel('koulutuslomake.valitseKoulutusalat').pipe(
          pFillAsyncSelect('Terveys')
        );

        getInputByLabel('koulutuslomake.koulutuksenNimi').pipe(
          paste('Opintojakso nimi')
        );

        getInputByLabel('yleiset.tunniste').pipe(paste('ABC-123'));

        getSelectByLabel('yleiset.opinnonTyyppi').pipe(
          pFillAsyncSelect('Muut opinnot')
        );
      });

      withinSection('description', () => {
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

      fillOrgSection(organisaatioOid);

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
          'kansallinenkoulutusluokitus2016koulutusalataso1_01'
        );

        getInputByLabel('koulutuslomake.muokkaaKoulutuksenNimea').should(
          'have.value',
          'Ammatillinen opettajankoulutus'
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
    'should be able to create lukiokoulutus',
    mutationTest(() => {
      fillCommon({ koulutustyyppiPath: ['lk'] });
      fillOrgSection(organisaatioOid);
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
      fillOrgSection(organisaatioOid);

      withinSection('information', () => {
        getByTestId('laajuusnumero').pipe(paste('38'));

        getInputByLabel('koulutuslomake.koulutuksenNimi').should(
          'have.value',
          'koulutustyypit.tuva'
        );
      });

      withinSection('description', () => {
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
      fillOrgSection(organisaatioOid);

      withinSection('information', () => {
        getByTestId('laajuusnumero').pipe(paste('53'));

        getInputByLabel('koulutuslomake.koulutuksenNimi').pipe(
          paste('vapaa sivistystyö nimi')
        );
      });

      withinSection('description', () => {
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
      fillOrgSection(organisaatioOid);

      withinSection('information', () => {
        getByTestId('laajuusnumero').pipe(paste('53'));

        getSelectByLabel('yleiset.laajuusyksikko').pipe(
          pFillSelect('opintopistettä')
        );

        getInputByLabel('koulutuslomake.koulutuksenNimi').pipe(
          paste('vapaa sivistystyö nimi')
        );
      });

      withinSection('description', () => {
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
      fillOrgSection(organisaatioOid);

      withinSection('information', () => {
        getByTestId('laajuusnumero').pipe(paste('60'));

        getInputByLabel('koulutuslomake.koulutuksenNimi').should(
          'have.value',
          'koulutustyypit.telma'
        );
      });

      withinSection('description', () => {
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
      fillOrgSection(organisaatioOid);

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
    'should be able to create erikoislääkäri-koulutus',
    mutationTest(() => {
      fillCommon({ koulutustyyppiPath: ['korkeakoulutus', 'erikoislaakari'] });
      fillOrgSection(organisaatioOid);

      withinSection('information', () => {
        getSelectByLabel('yleiset.valitseKoulutus').pipe(
          pFillAsyncSelect('Erikoislääkäri')
        );

        getInputByLabel('koulutuslomake.koulutuksenNimi').pipe(
          paste('erikoislääkäri-koulutus nimi')
        );
      });

      withinSection('description', () => {
        getInputByLabel('yleiset.kuvaus').pipe(paste('Kuvaus'));
      });

      fillJarjestajaSection();

      fillTilaSection();

      getByTestId('soraKuvausSection').should('not.exist');

      tallenna();
    })
  );

  it(
    'should be able to create "Aikuisten perusopetus" -koulutus',
    mutationTest(() => {
      fillCommon({ koulutustyyppiPath: ['aikuisten-perusopetus'] });
      fillOrgSection(organisaatioOid);

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
    'should be able to create DIA-koulutus',
    mutationTest(() => {
      fillCommon({ koulutustyyppiPath: ['lk'] });
      fillOrgSection(organisaatioOid);

      withinSection('information', () => {
        getSelectByLabel('yleiset.valitseKoulutus').pipe(
          pFillAsyncSelect('Deutsche Internationale Abitur; Reifeprüfung')
        );

        getSelectByLabel('koulutuslomake.valitseKoulutusalat').should(
          'have.text',
          'kansallinenkoulutusluokitus2016koulutusalataso1_00'
        );

        getInputByLabel('koulutuslomake.muokkaaKoulutuksenNimea').should(
          'have.value',
          'Deutsche Internationale Abitur; Reifeprüfung'
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
    'should be able to create EB-koulutus',
    mutationTest(() => {
      fillCommon({ koulutustyyppiPath: ['lk'] });
      fillOrgSection(organisaatioOid);

      withinSection('information', () => {
        getSelectByLabel('yleiset.valitseKoulutus').pipe(
          pFillAsyncSelect('EB-tutkinto (European Baccalaureate)')
        );

        getSelectByLabel('koulutuslomake.valitseKoulutusalat').should(
          'have.text',
          'kansallinenkoulutusluokitus2016koulutusalataso1_00'
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

  it(
    'should be able to create erikoistumiskoulutus',
    mutationTest(() => {
      fillCommon({
        koulutustyyppiPath: ['korkeakoulutus', 'erikoistumiskoulutus'],
      });
      fillOrgSection(organisaatioOid);

      withinSection('information', () => {
        getSelectByLabel('koulutuslomake.valitseErikoistumiskoulutus').pipe(
          pFillAsyncSelect('Big Data Analytics')
        );
        getRadio('range').click({ force: true });
        getByTestId('laajuusMin').find('input').pipe(paste('5'));
        getByTestId('laajuusMax').find('input').pipe(paste('10'));
        getByTestId('forcedLaajuusyksikko')
          .find('input')
          .should('have.value', 'opintopistettä');
        getSelectByLabel('koulutuslomake.valitseKoulutusalat').pipe(
          pFillAsyncSelect('Tietojenkäsittely ja tietoliikenne (ICT)')
        );
        getInputByLabel('koulutuslomake.muokkaaKoulutuksenNimea').should(
          'have.value',
          'Big Data Analytics'
        );
      });

      withinSection('description', () => {
        getInputByLabel('yleiset.kuvaus').pipe(paste('Kuvaus'));
      });

      fillLisatiedotSection();

      fillJarjestajaSection();

      fillTilaSection();

      tallenna();
    })
  );

  it('using an existing object as baseline it should not copy publishing state', () => {
    fillKoulutustyyppiSection(['korkeakoulutus', 'amk']);
    fillPohjaSectionCopyingValuesFrom('Koulutuksen nimi');
    tilaShouldBe('tallennettu');
  });
};
