import {
  getSelectOption,
  getCheckbox,
  chooseKieliversiotLanguages,
  selectOption,
  fillTreeSelect,
  fillKoulutustyyppiSelect,
  getRadio,
  fillAsyncSelect,
  getByTestId,
  jatka,
  paste,
} from '#/cypress/utils';

import { stubKoulutusFormRoutes } from '#/cypress/koulutusFormUtils';

const fillTilaSection = (tila = 'julkaistu') => {
  getByTestId('tilaSection').within(() => {
    getRadio(tila).check({ force: true });
  });
};

const fillKoulutustyyppiSection = path => {
  getByTestId('koulutustyyppiSection').within(() => {
    fillKoulutustyyppiSelect(path);
    jatka();
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

const fillLisatiedotSection = () => {
  getByTestId('lisatiedotSection').within(() => {
    getByTestId('osiotSelect').click();

    getByTestId('osiotSelect').within(() => {
      getSelectOption('koulutuksenlisatiedot_0').click({
        force: true,
      });
    });

    getByTestId('osioKuvaus.koulutuksenlisatiedot_0#1').within(() => {
      cy.get('textarea').pipe(paste('koulutuksenlisatiedot_0 kuvaus'));
    });

    jatka();
  });
};

const fillTeemakuvaSection = () => {
  getByTestId('teemakuvaSection').within(() => {
    jatka();
  });
};

const tallenna = () => {
  getByTestId('tallennaKoulutusButton').within(() => {
    cy.contains('Tallenna').click({ force: false });
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
  fillKieliversiotSection();
};

const fillNakyvyysSection = () => {
  getByTestId('julkinenSection').within(() => {
    getCheckbox(null).click({ force: true });
    jatka();
  });
};

describe('createKoulutusForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';

  beforeEach(() => {
    cy.server();
    stubKoulutusFormRoutes({ organisaatioOid });

    cy.visit(`/organisaatio/${organisaatioOid}/koulutus?johtaaTutkintoon=true`);
  });

  it('should be able to create ammatillinen koulutus', () => {
    cy.route({
      method: 'PUT',
      url: '**/koulutus',
      response: {
        oid: '1.2.3.4.5.6',
      },
    }).as('createAmmKoulutusResponse');

    fillCommon({ koulutustyyppiPath: ['amm'] });

    getByTestId('informationSection').within(() => {
      getByTestId('koulutustyyppiSelect').click();

      getByTestId('koulutustyyppiSelect').within(() => {
        fillAsyncSelect('0', 'koulutus_0');
      });

      getByTestId('ePerusteSelect').within(() => {
        fillAsyncSelect('1', 'koulutus_0');
      });

      jatka();
    });

    getByTestId('descriptionSection').within(() => {
      jatka();
    });

    fillLisatiedotSection();

    fillJarjestajaSection();

    fillNakyvyysSection();

    fillTilaSection();

    tallenna();

    cy.wait('@createAmmKoulutusResponse').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });
  });

  it('should be able to create korkeakoulu koulutus', () => {
    cy.route({
      method: 'PUT',
      url: '**/koulutus',
      response: {
        oid: '1.2.3.4.5.6',
      },
    }).as('createYoKoulutusResponse');

    fillCommon({ koulutustyyppiPath: ['korkeakoulutus', 'yo'] });

    getByTestId('informationSection').within(() => {
      getByTestId('koulutuskoodiSelect').click();

      getByTestId('koulutuskoodiSelect').within(() => {
        fillAsyncSelect('0', 'koulutus_0');
      });

      getByTestId('nimiInput').within(() => {
        cy.get('input').clear().pipe(paste('Tiedot nimi'));
      });

      getByTestId('tutkintonimikeSelect').click();

      getByTestId('tutkintonimikeSelect').within(() => {
        getSelectOption('tutkintonimikekk_0').click({ force: true });
      });

      getByTestId('koulutusalatSelect').within(() => {
        selectOption('kansallinenkoulutusluokitus2016koulutusalataso2_0');
      });

      getByTestId('opintojenLaajuusSelect').click();

      getByTestId('opintojenLaajuusSelect').within(() => {
        getSelectOption('opintojenlaajuus_0').click({ force: true });
      });

      jatka();
    });

    getByTestId('descriptionSection').within(() => {
      getByTestId('kuvauksenNimiInput').within(() => {
        cy.get('input').pipe(paste('Kuvauksen nimi'));
      });

      getByTestId('kuvausInput').within(() => {
        cy.get('textarea').pipe(paste('Kuvaus'));
      });

      jatka();
    });

    fillLisatiedotSection();

    fillTeemakuvaSection();

    fillJarjestajaSection();

    fillNakyvyysSection();

    fillTilaSection();

    tallenna();

    cy.wait('@createYoKoulutusResponse').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });
  });

  it('should be able to create lukiokoulutus', () => {
    cy.route({
      method: 'PUT',
      url: '**/koulutus',
      response: {
        oid: '1.2.3.4.5.6',
      },
    }).as('createLkKoulutusResponse');

    fillCommon({ koulutustyyppiPath: ['lk'] });

    getByTestId('informationSection').within(() => {
      getByTestId('koulutustyyppiSelect').click();

      getByTestId('koulutustyyppiSelect').within(() => {
        fillAsyncSelect('0', 'koulutus_0');
      });

      jatka();
    });

    getByTestId('descriptionSection').within(() => {
      jatka();
    });

    fillLisatiedotSection();

    fillJarjestajaSection();

    fillNakyvyysSection();

    fillTilaSection();

    tallenna();

    cy.wait('@createLkKoulutusResponse').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });
  });
});
