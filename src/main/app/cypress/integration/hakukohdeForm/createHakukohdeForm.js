import merge from 'lodash/merge';

import {
  getByTestId,
  getRadio,
  selectOption,
  getCheckbox,
  fillDateTimeInput,
  chooseKieliversiotLanguages,
} from '../../utils';

import koulutus from '../../data/koulutus';
import toteutus from '../../data/toteutus';
import valintaperuste from '../../data/valintaperuste';
import { stubHakukohdeFormRoutes } from '../../hakukohdeFormUtils';

const jatka = cy => {
  getByTestId('jatkaButton', cy).click({ force: true });
};

const lisaa = cy => {
  getByTestId('lisaaButton', cy).click({ force: true });
};

const tallenna = cy => {
  getByTestId('tallennaJaJulkaiseHakukohdeButton', cy).click({ force: true });
};

const fillKieliversiotSection = cy => {
  getByTestId('kieliversiotSection', cy).within(() => {
    chooseKieliversiotLanguages(['fi'], cy);
    jatka(cy);
  });
};

const fillPohjakoulutusvaatimusSection = cy => {
  getByTestId('pohjakoulutusvaatimusSection', cy).within(() => {
    selectOption('pohjakoulutusvaatimustoinenaste_0', cy);

    jatka(cy);
  });
};

const fillDatetime = ({ date, time, cy }) => {
  fillDateTimeInput({ date, time, cy });
};

const fillHakuajatSection = cy => {
  getByTestId('hakuajatSection', cy).within(() => {
    getCheckbox('eriHakuaika', cy).click({ force: true });
    lisaa(cy);

    getByTestId('alkaa', cy).within(() => {
      fillDatetime({
        date: '02.04.2019',
        time: '10:45',
        cy,
      });
    });

    getByTestId('paattyy', cy).within(() => {
      fillDatetime({
        date: '25.11.2019',
        time: '23:59',
        cy,
      });
    });

    jatka(cy);
  });
};

const fillPerustiedotSection = cy => {
  getByTestId('perustiedotSection', cy).within(() => {
    getByTestId('nimi', cy)
      .find('input')
      .type('Hakukohteen nimi', { force: true });

    jatka(cy);
  });
};

const fillLomakeSection = cy => {
  getByTestId('lomakeSection', cy).within(() => {
    jatka(cy);
  });
};

const fillAlkamiskausiSection = cy => {
  getByTestId('alkamiskausiSection', cy).within(() => {
    getRadio('kausi_0#1', cy).click({ force: true });
    selectOption(new Date().getFullYear().toString(), cy);
    jatka(cy);
  });
};

const fillAloituspaikatSection = cy => {
  getByTestId('aloituspaikatSection', cy).within(() => {
    cy.get('input').type('100', { force: true });
    jatka(cy);
  });
};

const fillValintaperusteenKuvausSection = cy => {
  getByTestId('valintaperusteenKuvausSection', cy).within(() => {
    selectOption('Valintaperusteen nimi', cy);
    jatka(cy);
  });
};

const fillValintakoeSection = cy => {
  getByTestId('valintakoeSection', cy).within(() => {
    getCheckbox('valintakokeentyyppi_0#1', cy).click({ force: true });

    lisaa(cy);

    getByTestId('valintakoelista', cy).within(() => {
      getByTestId('osoite', cy)
        .find('input')
        .type('Osoite', { force: true });
      getByTestId('postinumero', cy)
        .find('input')
        .type('00940', { force: true });
      getByTestId('postitoimipaikka', cy)
        .find('input')
        .type('Helsinki', { force: true });

      getByTestId('alkaa', cy).within(() => {
        fillDatetime({
          date: '02.04.2019',
          time: '10:45',
          cy,
        });
      });

      getByTestId('paattyy', cy).within(() => {
        fillDatetime({
          date: '25.11.2019',
          time: '23:59',
          cy,
        });
      });

      getByTestId('lisatietoa', cy)
        .find('textarea')
        .type('Lisätietoa', { force: true });
    });

    jatka(cy);
  });
};

const fillLiitteetSection = cy => {
  getByTestId('liitteetSection', cy).within(() => {
    lisaa(cy);

    getByTestId('liitelista', cy).within(() => {
      getByTestId('tyyppi', cy).within(() => {
        selectOption('liitetyypitamm_0', cy);
      });

      getByTestId('nimi', cy)
        .find('input')
        .type('Nimi', { force: true });
      getByTestId('kuvaus', cy)
        .find('textarea')
        .type('Kuvaus', { force: true });

      fillDatetime({
        date: '25.11.2019',
        time: '23:59',
        cy,
      });

      getByTestId('osoite', cy)
        .find('input')
        .type('Osoite', { force: true });
      getByTestId('postinumero', cy)
        .find('input')
        .type('00940', { force: true });
      getByTestId('postitoimipaikka', cy)
        .find('input')
        .type('Helsinki', { force: true });
      getByTestId('sahkoposti', cy)
        .find('input')
        .type('sahkoposti@email.com', { force: true });
    });
  });
};

describe('createHakukohdeForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const toteutusOid = '2.1.1.1.1.1';
  const koulutusOid = '3.1.1.1.1';
  const hakuOid = '4.1.1.1.1.1';
  const valintaperusteOid = '5.1.1.1.1.1';

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

  it('should be able to create hakukohde', () => {
    cy.route({
      method: 'PUT',
      url: '**/hakukohde',
      response: {
        oid: '1.2.3.4.5.6',
      },
    }).as('createHakukohdeRequest');

    fillKieliversiotSection(cy);
    fillPohjakoulutusvaatimusSection(cy);
    fillPerustiedotSection(cy);
    fillHakuajatSection(cy);
    fillLomakeSection(cy);
    fillAlkamiskausiSection(cy);
    fillAloituspaikatSection(cy);
    fillValintaperusteenKuvausSection(cy);
    fillValintakoeSection(cy);
    fillLiitteetSection(cy);

    tallenna(cy);

    cy.wait('@createHakukohdeRequest').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });
  });
});
