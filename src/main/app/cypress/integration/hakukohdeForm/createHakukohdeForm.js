import merge from 'lodash/merge';

import {
  getRadio,
  selectOption,
  getCheckbox,
  fillDateTimeInput,
  chooseKieliversiotLanguages,
  fillValintakoeFields,
} from '../../utils';

import koulutus from '../../data/koulutus';
import toteutus from '../../data/toteutus';
import valintaperuste from '../../data/valintaperuste';
import { stubHakukohdeFormRoutes } from '../../hakukohdeFormUtils';

const jatka = () => {
  cy.getByTestId('jatkaButton').click({ force: true });
};

const lisaa = () => {
  cy.getByTestId('lisaaButton').click({ force: true });
};

const tallenna = () => {
  cy.getByTestId('tallennaHakukohdeButton').click({ force: true });
};

const fillKieliversiotSection = () => {
  cy.getByTestId('kieliversiotSection').within(() => {
    chooseKieliversiotLanguages(['fi'], cy);
    jatka();
  });
};

const fillPohjakoulutusvaatimusSection = () => {
  cy.getByTestId('pohjakoulutusvaatimusSection').within(() => {
    selectOption('pohjakoulutusvaatimustoinenaste_0', cy);

    jatka();
  });
};

const fillDatetime = ({ date, time }) => {
  fillDateTimeInput({ date, time, cy });
};

const fillHakuajatSection = () => {
  cy.getByTestId('hakuajatSection').within(() => {
    getCheckbox(null, cy).click({ force: true });
    lisaa();

    cy.getByTestId('alkaa').within(() => {
      fillDatetime({
        date: '02.04.2019',
        time: '10:45',
      });
    });

    cy.getByTestId('paattyy').within(() => {
      fillDatetime({
        date: '25.11.2019',
        time: '23:59',
      });
    });
  });
};

const fillPerustiedotSection = ({ isKorkeakoulu = false } = {}) => {
  cy.getByTestId('perustiedotSection').within(() => {
    cy.getByTestId('hakukohteenNimi')
      .find('input')
      .type('Hakukohteen nimi', { force: true });

    if (!isKorkeakoulu) {
      cy.getByTestId('voiSuorittaaKaksoistutkinnon').within(() => {
        getCheckbox(null, cy).click({ force: true });
      });
    }

    fillHakuajatSection();
    fillAlkamiskausiSection();
    fillLomakeSection();

    jatka();
  });
};

const fillLomakeSection = () => {
  cy.getByTestId('lomakeSection').within(() => {
    cy.getByTestId('eriHakulomake').within(() => {
      getCheckbox(null, cy).click({ force: true });
    });

    getRadio('ataru', cy).click({ force: true });
    selectOption('Lomake 1', cy);
  });
};

const fillAlkamiskausiSection = () => {
  cy.getByTestId('alkamiskausiSection').within(() => {
    cy.getByTestId('eriAlkamiskausi').within(() => {
      getCheckbox(null, cy).click({ force: true });
    });

    getRadio('kausi_0#1', cy).click({ force: true });
    selectOption(new Date().getFullYear().toString(), cy);
  });
};

const fillAloituspaikatSection = ({ isKorkeakoulu = false } = {}) => {
  cy.getByTestId('aloituspaikatSection').within(() => {
    cy.getByTestId('aloituspaikkamaara').within(() => {
      cy.getByTestId('min')
        .find('input')
        .type('5', { force: true });
      cy.getByTestId('max')
        .find('input')
        .type('10', { force: true });
    });

    if (isKorkeakoulu) {
      cy.getByTestId('ensikertalaismaara').within(() => {
        cy.getByTestId('min')
          .find('input')
          .type('1', { force: true });
        cy.getByTestId('max')
          .find('input')
          .type('5', { force: true });
      });
    }

    jatka();
  });
};

const fillValintaperusteenKuvausSection = () => {
  cy.getByTestId('valintaperusteenKuvausSection').within(() => {
    selectOption('Valintaperusteen nimi', cy);
    jatka();
  });
};

const fillValintakoeSection = () => {
  cy.getByTestId('valintakoeSection').within(() => {
    fillValintakoeFields({ cy });
    jatka();
  });
};

const fillLiitteetSection = () => {
  cy.getByTestId('liitteetSection').within(() => {
    lisaa();

    cy.getByTestId('liitelista').within(() => {
      cy.getByTestId('tyyppi').within(() => {
        selectOption('liitetyypitamm_0', cy);
      });

      cy.getByTestId('nimi')
        .find('input')
        .type('Nimi', { force: true });

      cy.getByTestId('kuvaus')
        .find('textarea')
        .type('Kuvaus', { force: true });

      fillDatetime({
        date: '25.11.2019',
        time: '23:59',
      });

      cy.getByTestId('toimitustapa').within(() => {
        getRadio('osoite', cy).click({ force: true });
      });

      cy.getByTestId('osoite')
        .find('input')
        .type('Osoite', { force: true });

      cy.getByTestId('postinumero')
        .find('input')
        .type('00940', { force: true });

      cy.getByTestId('postitoimipaikka')
        .find('input')
        .type('Helsinki', { force: true });

      cy.getByTestId('sahkoposti')
        .find('input')
        .type('sahkoposti@email.com', { force: true });
    });

    jatka();
  });
};

const fillTilaSection = (tila = 'julkaistu') => {
  cy.getByTestId('tilaSection').within(() => {
    getRadio(tila, cy).check({ force: true });
  });
};

describe('createHakukohdeForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const toteutusOid = '2.1.1.1.1.1';
  const koulutusOid = '3.1.1.1.1';
  const hakuOid = '4.1.1.1.1.1';
  const valintaperusteOid = '5.1.1.1.1.1';
  const createdHakukohdeOid = '1.2.3.4.5.6';

  beforeEach(() => {
    cy.server();

    stubHakukohdeFormRoutes({ cy, organisaatioOid, hakuOid });

    cy.route({
      method: 'GET',
      url: '**/valintaperuste/list**',
      response: [
        merge(valintaperuste(), {
          oid: valintaperusteOid,
          nimi: { fi: 'Valintaperusteen nimi' },
        }),
      ],
    });

    cy.route({
      method: 'GET',
      url: `**/toteutus/${toteutusOid}`,
      response: merge(toteutus({ tyyppi: 'amm' }), {
        oid: toteutusOid,
        organisaatioOid: organisaatioOid,
        koulutusOid: koulutusOid,
      }),
    });

    cy.route({
      method: 'GET',
      url: `**/koulutus/${koulutusOid}`,
      response: merge(koulutus({ tyyppi: 'amm' }), {
        oid: koulutusOid,
        organisaatioOid: organisaatioOid,
      }),
    });

    cy.visit(
      `/organisaatio/${organisaatioOid}/toteutus/${toteutusOid}/haku/${hakuOid}/hakukohde`,
    );
  });

  it('should be able to create ammatillinen hakukohde', () => {
    cy.route({
      method: 'PUT',
      url: '**/hakukohde',
      response: {
        oid: createdHakukohdeOid,
      },
    }).as('createHakukohdeRequest');

    fillKieliversiotSection();
    fillPohjakoulutusvaatimusSection();
    fillPerustiedotSection();
    fillAloituspaikatSection();
    fillValintaperusteenKuvausSection();
    fillValintakoeSection();
    fillLiitteetSection();
    fillTilaSection();
    tallenna();

    cy.wait('@createHakukohdeRequest').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });

    cy.location('pathname').should(
      'eq',
      `/kouta/hakukohde/${createdHakukohdeOid}/muokkaus`,
    );
  });

  it('should be able to create korkeakoulu hakukohde', () => {
    cy.route({
      method: 'GET',
      url: `**/koulutus/${koulutusOid}`,
      response: merge(koulutus({ tyyppi: 'yo' }), {
        oid: koulutusOid,
        organisaatioOid: organisaatioOid,
      }),
    });

    cy.route({
      method: 'PUT',
      url: '**/hakukohde',
      response: {
        oid: createdHakukohdeOid,
      },
    }).as('createHakukohdeRequest');

    fillKieliversiotSection();
    fillPohjakoulutusvaatimusSection();
    fillPerustiedotSection({ isKorkeakoulu: true });
    fillAloituspaikatSection({ isKorkeakoulu: true });
    fillValintaperusteenKuvausSection();
    fillValintakoeSection();
    fillLiitteetSection();
    fillTilaSection();

    tallenna();

    cy.wait('@createHakukohdeRequest').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });

    cy.location('pathname').should(
      'eq',
      `/kouta/hakukohde/${createdHakukohdeOid}/muokkaus`,
    );
  });
});
