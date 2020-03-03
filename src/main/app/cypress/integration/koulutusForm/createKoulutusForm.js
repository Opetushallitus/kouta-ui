import {
  getSelectOption,
  getCheckbox,
  chooseKieliversiotLanguages,
  selectOption,
  fillTreeSelect,
  fillKoulutustyyppiSelect,
  getRadio,
  fillAsyncSelect,
} from '../../utils';

import { stubKoulutusFormRoutes } from '../../koulutusFormUtils';

const jatka = () => {
  cy.getByTestId('jatkaButton').click({ force: true });
};

const fillTilaSection = (tila = 'julkaistu') => {
  cy.getByTestId('tilaSection').within(() => {
    getRadio(tila, cy).check({ force: true });
  });
};

const fillKoulutustyyppiSection = path => {
  cy.getByTestId('tyyppiSection').within(() => {
    fillKoulutustyyppiSelect(path, cy);
    jatka();
  });
};

const fillPohjaSection = () => {
  cy.getByTestId('pohjaSection').within(() => {
    cy.getByTestId('jatkaButton').click({ force: true });
  });
};

const fillKieliversiotSection = () => {
  cy.getByTestId('kieliversiotSection').within(() => {
    chooseKieliversiotLanguages(['fi'], cy);
    cy.getByTestId('jatkaButton').click({ force: true });
  });
};

const fillLisatiedotSection = () => {
  cy.getByTestId('lisatiedotSection').within(() => {
    cy.getByTestId('osiotSelect').click();

    cy.getByTestId('osiotSelect').within(() => {
      getSelectOption('koulutuksenlisatiedot_0', cy).click({
        force: true,
      });
    });

    cy.getByTestId('osioKuvaus.koulutuksenlisatiedot_0#1').within(() => {
      cy.get('textarea').type('koulutuksenlisatiedot_0 kuvaus', {
        force: true,
      });
    });

    cy.getByTestId('jatkaButton').click({ force: true });
  });
};

const fillTeemakuvaSection = () => {
  cy.getByTestId('teemakuvaSection').within(() => {
    cy.getByTestId('jatkaButton').click({ force: true });
  });
};

const tallenna = () => {
  cy.getByTestId('tallennaKoulutusButton').within(() => {
    cy.contains('Tallenna').click({ force: false });
  });
};

const fillJarjestajaSection = () => {
  cy.getByTestId('jarjestajaSection').within(() => {
    cy.getByTestId('jarjestajatSelection').within(() => {
      fillTreeSelect(['1.2.1.1.1.1'], cy);
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
  cy.getByTestId('nakyvyysSection').within(() => {
    getCheckbox(null, cy).click({ force: true });
    jatka();
  });
};

describe('createKoulutusForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';

  beforeEach(() => {
    stubKoulutusFormRoutes({ cy, organisaatioOid });

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

    cy.getByTestId('tiedotSection').within(() => {
      cy.getByTestId('koulutustyyppiSelect').click();

      cy.getByTestId('koulutustyyppiSelect').within(() => {
        fillAsyncSelect('0', 'koulutus_0');
      });

      cy.getByTestId('ePerusteSelect').within(() => {
        fillAsyncSelect('1', 'koulutus_0');
      });

      cy.getByTestId('jatkaButton').click({ force: true });
    });

    cy.getByTestId('kuvausSection').within(() => {
      cy.getByTestId('jatkaButton').click({ force: true });
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

    cy.getByTestId('tiedotSection').within(() => {
      cy.getByTestId('koulutuskoodiSelect').click();

      cy.getByTestId('koulutuskoodiSelect').within(() => {
        fillAsyncSelect('0', 'koulutus_0');
      });

      cy.getByTestId('nimiInput').within(() => {
        cy.get('input')
          .clear()
          .type('Tiedot nimi', { force: true });
      });

      cy.getByTestId('tutkintonimikeSelect').click();

      cy.getByTestId('tutkintonimikeSelect').within(() => {
        getSelectOption('tutkintonimikekk_0', cy).click({ force: true });
      });

      cy.getByTestId('koulutusalatSelect').within(() => {
        selectOption('kansallinenkoulutusluokitus2016koulutusalataso2_0', cy);
      });

      cy.getByTestId('opintojenLaajuusSelect').click();

      cy.getByTestId('opintojenLaajuusSelect').within(() => {
        getSelectOption('opintojenlaajuus_0', cy).click({ force: true });
      });

      jatka();
    });

    cy.getByTestId('kuvausSection').within(() => {
      cy.getByTestId('kuvauksenNimiInput').within(() => {
        cy.get('input').type('Kuvauksen nimi', { force: true });
      });

      cy.getByTestId('kuvausInput').within(() => {
        cy.get('textarea').type('Kuvaus', { force: true });
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

    cy.getByTestId('tiedotSection').within(() => {
      cy.getByTestId('koulutustyyppiSelect').click();

      cy.getByTestId('koulutustyyppiSelect').within(() => {
        fillAsyncSelect('0', 'koulutus_0');
      });

      cy.getByTestId('jatkaButton').click({ force: true });
    });

    cy.getByTestId('kuvausSection').within(() => {
      cy.getByTestId('jatkaButton').click({ force: true });
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
