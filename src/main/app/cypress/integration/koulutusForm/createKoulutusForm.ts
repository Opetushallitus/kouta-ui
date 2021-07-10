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
  jatka,
  paste,
  fillKieliversiotSection,
  fillPohjaSection,
  fillTilaSection,
  tallenna,
  fillKoulutustyyppiSection,
  typeToEditor,
  wrapMutationTest,
} from '#/cypress/utils';
import { ENTITY } from '#/src/constants';

const fillLisatiedotSection = () => {
  getByTestId('lisatiedotSection').within(() => {
    getByTestId('osiotSelect').click();

    getByTestId('osiotSelect').within(() => {
      getSelectOption('Opintojen rakenne').click({
        force: true,
      });
    });

    getByTestId('osioKuvaus.koulutuksenlisatiedot_01#1').within(() => {
      typeToEditor('koulutuksenlisatiedot kuvaus');
    });

    jatka();
  });
};

const fillTeemakuvaSection = () => {
  getByTestId('teemakuvaSection').within(() => {
    jatka();
  });
};

const fillSoraKuvausSection = () => {
  getByTestId('soraKuvausSection').within(() => {
    selectOption('Sora-kuvaus 1');

    jatka();
  });
};

const fillJarjestajaSection = () => {
  getByTestId('tarjoajatSection').within(() => {
    getByTestId('jarjestajatSelection').within(() => {
      fillTreeSelect(['1.2.1.1.1.1']);
    });

    jatka();
  });
};

const fillCommon = ({ koulutustyyppiPath }) => {
  fillKoulutustyyppiSection(koulutustyyppiPath);
  fillPohjaSection();
  fillKieliversiotSection({ jatka: true });
};

const fillNakyvyysSection = () => {
  getByTestId('julkinenSection').within(() => {
    getCheckbox(null).click({ force: true });
    jatka();
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
    entity: ENTITY.KOULUTUS,
    oid: koulutusOid,
  });

  it(
    'should be able to create ammatillinen koulutus',
    mutationTest(() => {
      fillCommon({ koulutustyyppiPath: ['amm'] });

      getByTestId('informationSection').within(() => {
        getByTestId('koulutusSelect').click();

        getByTestId('koulutusSelect').within(() => {
          fillAsyncSelect('Kaivosalan perustutkinto');
        });

        getByTestId('ePerusteSelect').within(() => {
          fillAsyncSelect('Kaivosalan perustutkinto');
        });

        jatka();
      });

      getByTestId('descriptionSection').within(() => {
        jatka();
      });

      fillLisatiedotSection();

      fillSoraKuvausSection();

      fillTeemakuvaSection();

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

      getByTestId('osaamisalaSection').within(() => {
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

        jatka();
      });

      getByTestId('osaamisalanKuvausSection').within(() => {
        jatka();
      });

      fillLisatiedotSection();

      fillSoraKuvausSection();

      fillTeemakuvaSection();

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

      getByTestId('tutkinnonosatSection').within(() => {
        getByTestId('lisaaKoulutusButton').click();

        getByTestId('koulutusSelect').click();

        getByTestId('koulutusSelect').within(() => {
          fillAsyncSelect('Kaivosalan perustutkinto');
        });

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

      getByTestId('nimiSection').within(() => {
        cy.findByLabelText(/koulutuslomake\.lisaaKoulutuksenNimi/).should(
          'have.value',
          'Louhintaporaus'
        );
      });

      getByTestId('tutkinnonosatSection').within(() => {
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

        jatka();
      });

      getByTestId('nimiSection').within(() => {
        jatka();
      });

      getByTestId('tutkinnonOsienKuvausSection').within(() => {
        jatka();
      });

      fillLisatiedotSection();

      fillSoraKuvausSection();

      fillTeemakuvaSection();

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

      getByTestId('informationSection').within(() => {
        getByTestId('korkeakoulutuskoodiSelect').click();

        getByTestId('korkeakoulutuskoodiSelect').within(() => {
          fillAsyncSelect('Fysioterapeutti (AMK)');
        });

        getByTestId('tutkintonimikeSelect').click();

        getByTestId('tutkintonimikeSelect').within(() => {
          getSelectOption('Arkkitehti').click({ force: true });
        });

        getByTestId('koulutusalatSelect').within(() => {
          selectOption('Arkkitehtuuri ja rakentaminen');
        });

        getByTestId('opintojenLaajuusSelect').click();

        getByTestId('opintojenLaajuusSelect').within(() => {
          getSelectOption('300').click({ force: true });
        });

        getByTestId('nimiInput').within(() => {
          cy.get('input').clear().pipe(paste('Tiedot nimi'));
        });

        jatka();
      });

      getByTestId('descriptionSection').within(() => {
        getByTestId('kuvauksenNimiInput').within(() => {
          cy.get('input').pipe(paste('Kuvauksen nimi'));
        });

        getByTestId('kuvausInput').within(() => {
          typeToEditor('Kuvaus');
        });

        jatka();
      });

      fillLisatiedotSection();

      fillSoraKuvausSection();

      fillTeemakuvaSection();

      fillJarjestajaSection();

      fillNakyvyysSection();

      fillTilaSection();

      tallenna();
    })
  );

  it(
    'should be able to create lukiokoulutus',
    mutationTest(() => {
      fillCommon({ koulutustyyppiPath: ['lk'] });

      getByTestId('informationSection').within(() => {
        getByTestId('koulutusSelect').click();

        getByTestId('koulutusSelect').within(() => {
          fillAsyncSelect('Ylioppilastutkinto');
        });

        jatka();
      });

      getByTestId('descriptionSection').within(() => {
        getByTestId('kuvausInput').within(() => {
          typeToEditor('Kuvaus');
        });

        jatka();
      });

      fillLisatiedotSection();

      fillSoraKuvausSection();

      fillTeemakuvaSection();

      fillJarjestajaSection();

      fillNakyvyysSection();

      fillTilaSection();

      tallenna();
    })
  );
};
