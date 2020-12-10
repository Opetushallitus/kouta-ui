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
} from '#/cypress/utils';

import { stubKoulutusFormRoutes } from '#/cypress/koulutusFormUtils';

const fillLisatiedotSection = () => {
  getByTestId('lisatiedotSection').within(() => {
    getByTestId('osiotSelect').click();

    getByTestId('osiotSelect').within(() => {
      getSelectOption('koulutuksenlisatiedot_0').click({
        force: true,
      });
    });

    getByTestId('osioKuvaus.koulutuksenlisatiedot_0#1').within(() => {
      typeToEditor('koulutuksenlisatiedot_0 kuvaus');
    });

    jatka();
  });
};

const fillTeemakuvaSection = () => {
  getByTestId('teemakuvaSection').within(() => {
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
    cy.server();
    stubKoulutusFormRoutes({ organisaatioOid });

    cy.route({
      method: 'GET',
      url: `**/koulutus/${koulutusOid}`,
      response: [],
    });

    cy.visit(`/organisaatio/${organisaatioOid}/koulutus?johtaaTutkintoon=true`);
  });

  it('should be able to create ammatillinen koulutus', () => {
    cy.route({
      method: 'PUT',
      url: '**/koulutus',
      response: {
        oid: koulutusOid,
      },
    }).as('createAmmKoulutusResponse');

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

    fillTeemakuvaSection();

    fillJarjestajaSection();

    fillNakyvyysSection();

    fillTilaSection();

    tallenna();

    cy.wait('@createAmmKoulutusResponse').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

  it('should be able to create ammatillinen osaamisala koulutus', () => {
    cy.route({
      method: 'PUT',
      url: '**/koulutus',
      response: {
        oid: koulutusOid,
      },
    }).as('createAmmKoulutusResponse');

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

    fillTeemakuvaSection();

    fillJarjestajaSection();

    fillNakyvyysSection();

    fillTilaSection();

    tallenna();

    cy.wait('@createAmmKoulutusResponse').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

  it('should be able to create ammatillinen tutkinnon osa koulutus', () => {
    cy.route({
      method: 'PUT',
      url: '**/koulutus',
      response: {
        oid: koulutusOid,
      },
    }).as('createAmmKoulutusResponse');

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

    fillTeemakuvaSection();

    fillJarjestajaSection();

    fillNakyvyysSection();

    fillTilaSection();

    tallenna();

    cy.wait('@createAmmKoulutusResponse').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

  it('should be able to create AMK-koulutus', () => {
    cy.route({
      method: 'PUT',
      url: '**/koulutus',
      response: {
        oid: koulutusOid,
      },
    }).as('createAmkKoulutusResponse');

    fillCommon({ koulutustyyppiPath: ['korkeakoulutus', 'amk'] });

    getByTestId('informationSection').within(() => {
      getByTestId('koulutuskoodiSelect').click();

      getByTestId('koulutuskoodiSelect').within(() => {
        fillAsyncSelect('Fysioterapeutti (AMK)');
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
        typeToEditor('Kuvaus');
      });

      jatka();
    });

    fillLisatiedotSection();

    fillTeemakuvaSection();

    fillJarjestajaSection();

    fillNakyvyysSection();

    fillTilaSection();

    tallenna();

    cy.wait('@createAmkKoulutusResponse').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

  it('should be able to create lukiokoulutus', () => {
    cy.route({
      method: 'PUT',
      url: '**/koulutus',
      response: {
        oid: koulutusOid,
      },
    }).as('createLkKoulutusResponse');

    fillCommon({ koulutustyyppiPath: ['lk'] });

    getByTestId('informationSection').within(() => {
      getByTestId('koulutusSelect').click();

      getByTestId('koulutusSelect').within(() => {
        fillAsyncSelect('Lukion oppimäärä');
      });

      jatka();
    });

    getByTestId('descriptionSection').within(() => {
      jatka();
    });

    fillLisatiedotSection();

    fillTeemakuvaSection();

    fillJarjestajaSection();

    fillNakyvyysSection();

    fillTilaSection();

    tallenna();

    cy.wait('@createLkKoulutusResponse').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });
};
