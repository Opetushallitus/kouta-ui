import {
  getRadio,
  getSelectOption,
  fillDateTimeInput,
  chooseKieliversiotLanguages,
  selectOption,
  fillValintakoeFields,
  fillYhteyshenkilotFields,
} from '../../utils';

import { stubHakuFormRoutes } from '../../hakuFormUtils';

const jatka = () => {
  cy.getByTestId('jatkaButton').click({ force: true });
};

const fillPohjaSection = () => {
  cy.getByTestId('pohjaSection').within(() => {
    jatka();
  });
};

const fillTilaSection = (tila = 'julkaistu') => {
  cy.getByTestId('tilaSection').within(() => {
    getRadio(tila, cy).check({ force: true });
  });
};

const fillKieliversiotSection = () => {
  cy.getByTestId('kieliversiotSection').within(() => {
    chooseKieliversiotLanguages(['fi'], cy);
    jatka();
  });
};

const fillNimiSection = () => {
  cy.getByTestId('nimiSection').within(() => {
    cy.get('input').type('haun nimi', { force: true });

    jatka();
  });
};

const fillKohdejoukkoSection = () => {
  cy.getByTestId('kohdejoukkoSection').within(() => {
    cy.getByTestId('kohdejoukko').within(() => {
      getRadio('haunkohdejoukko_12#1', cy).click({ force: true });
    });

    cy.getByTestId('tarkenne').within(() => {
      selectOption('haunkohdejoukontarkenne_0', cy);
    });

    jatka();
  });
};

const fillHakutapaSection = () => {
  cy.getByTestId('hakutapaSection').within(() => {
    getRadio('hakutapa_01#1', cy).click({ force: true });

    jatka();
  });
};

const lisaa = () => {
  cy.getByTestId('lisaaButton').click({ force: true });
};

const fillDatetime = ({ date, time, cy }) => {
  fillDateTimeInput({ date, time, cy });
};

const fillAikatauluSection = () => {
  cy.getByTestId('aikatauluSection').within(() => {
    cy.getByTestId('hakuajat').within(() => {
      cy.getByTestId('alkaa').within(() => {
        fillDatetime({
          date: '02.04.2019',
          time: '10:45',
          cy,
        });
      });

      cy.getByTestId('paattyy').within(() => {
        fillDatetime({
          date: '25.11.2019',
          time: '23:59',
          cy,
        });
      });
    });

    cy.getByTestId('tulevaisuudenaikataulu').within(() => {
      lisaa();

      cy.getByTestId('alkaa').within(() => {
        fillDatetime({
          date: '11.10.2019',
          time: '09:05',
          cy,
        });
      });

      cy.getByTestId('paattyy').within(() => {
        fillDatetime({
          date: '25.12.2019',
          time: '20:30',
          cy,
        });
      });
    });

    cy.getByTestId('alkamiskausi').within(() => {
      getRadio('kausi_0#1', cy).click({ force: true });

      cy.getByTestId('vuosi').click();

      cy.getByTestId('vuosi').within(() => {
        getSelectOption(new Date().getFullYear().toString(), cy).click({
          force: true,
        });
      });
    });

    cy.getByTestId('perumisenTakaraja').within(() => {
      fillDatetime({
        date: '24.12.2019',
        time: '21:20',
        cy,
      });
    });

    cy.getByTestId('muokkauksenTakaraja').within(() => {
      fillDatetime({
        date: '11.12.2019',
        time: '19:15',
        cy,
      });
    });

    cy.getByTestId('julkaisupaivamaara').within(() => {
      fillDatetime({
        date: '05.12.2019',
        time: '06:45',
        cy,
      });
    });

    jatka();
  });
};

const fillHakulomakeSection = () => {
  cy.getByTestId('hakulomakeSection').within(() => {
    getRadio('ataru', cy).click({ force: true });
    selectOption('Lomake 1', cy);

    jatka();
  });
};

const tallenna = () => {
  cy.getByTestId('tallennaHakuButton').click({ force: true });
};

const fillValintakoeSection = () => {
  cy.getByTestId('valintakoeSection').within(() => {
    fillValintakoeFields({ cy });
    jatka();
  });
};

const fillYhteystiedotSection = () => {
  cy.getByTestId('yhteystiedotSection').within(() => {
    fillYhteyshenkilotFields({ cy });
    jatka();
  });
};

describe('createHakuForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const createdHakuOid = '1.2.3.4.5.6';

  beforeEach(() => {
    stubHakuFormRoutes({ cy, organisaatioOid });

    cy.visit(`/organisaatio/${organisaatioOid}/haku`);
  });

  it('should be able to create haku', () => {
    cy.route({
      method: 'PUT',
      url: '**/haku',
      response: {
        oid: createdHakuOid,
      },
    }).as('createHakuRequest');

    fillPohjaSection();
    fillKieliversiotSection();
    fillNimiSection();
    fillKohdejoukkoSection();
    fillHakutapaSection();
    fillAikatauluSection();
    fillHakulomakeSection();
    fillValintakoeSection();
    fillYhteystiedotSection();
    fillTilaSection();

    tallenna();

    cy.wait('@createHakuRequest').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });

    cy.location('pathname').should(
      'eq',
      `/kouta/haku/${createdHakuOid}/muokkaus`,
    );
  });
});
