import {
  getByTestId,
  getRadio,
  getSelectOption,
  fillDateTimeInput,
  chooseKieliversiotLanguages,
  selectOption,
  fillValintakoeFields,
  fillYhteyshenkilotFields,
} from '../../utils';

import { stubHakuFormRoutes } from '../../hakuFormUtils';

const jatka = cy => {
  getByTestId('jatkaButton', cy).click({ force: true });
};

const fillPohjaSection = cy => {
  getByTestId('pohjaSection', cy).within(() => {
    jatka(cy);
  });
};

const fillKieliversiotSection = cy => {
  getByTestId('kieliversiotSection', cy).within(() => {
    chooseKieliversiotLanguages(['fi'], cy);
    jatka(cy);
  });
};

const fillNimiSection = cy => {
  getByTestId('nimiSection', cy).within(() => {
    cy.get('input').type('haun nimi', { force: true });

    jatka(cy);
  });
};

const fillKohdejoukkoSection = cy => {
  cy.getByTestId('kohdejoukkoSection').within(() => {
    cy.getByTestId('kohdejoukko').within(() => {
      getRadio('haunkohdejoukko_12#1', cy).click({ force: true });
    });

    cy.getByTestId('tarkenne').within(() => {
      getRadio('haunkohdejoukontarkenne_0#1', cy).click({ force: true });
    });

    jatka(cy);
  });
};

const fillHakutapaSection = cy => {
  getByTestId('hakutapaSection', cy).within(() => {
    getRadio('hakutapa_01#1', cy).click({ force: true });

    jatka(cy);
  });
};

const lisaa = cy => {
  getByTestId('lisaaButton', cy).click({ force: true });
};

const fillDatetime = ({ date, time, cy }) => {
  fillDateTimeInput({ date, time, cy });
};

const fillAikatauluSection = cy => {
  getByTestId('aikatauluSection', cy).within(() => {
    getByTestId('hakuajat', cy).within(() => {
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
    });

    getByTestId('tulevaisuudenaikataulu', cy).within(() => {
      lisaa(cy);

      getByTestId('alkaa', cy).within(() => {
        fillDatetime({
          date: '11.10.2019',
          time: '09:05',
          cy,
        });
      });

      getByTestId('paattyy', cy).within(() => {
        fillDatetime({
          date: '25.12.2019',
          time: '20:30',
          cy,
        });
      });
    });

    getByTestId('alkamiskausi', cy).within(() => {
      getRadio('kausi_0#1', cy).click({ force: true });

      getByTestId('vuosi', cy).click();

      getByTestId('vuosi', cy).within(() => {
        getSelectOption(new Date().getFullYear().toString(), cy).click({
          force: true,
        });
      });
    });

    getByTestId('perumisenTakaraja', cy).within(() => {
      fillDatetime({
        date: '24.12.2019',
        time: '21:20',
        cy,
      });
    });

    getByTestId('muokkauksenTakaraja', cy).within(() => {
      fillDatetime({
        date: '11.12.2019',
        time: '19:15',
        cy,
      });
    });

    getByTestId('julkaisupaivamaara', cy).within(() => {
      fillDatetime({
        date: '05.12.2019',
        time: '06:45',
        cy,
      });
    });

    jatka(cy);
  });
};

const fillHakulomakeSection = cy => {
  getByTestId('hakulomakeSection', cy).within(() => {
    getRadio('ataru', cy).click({ force: true });
    selectOption('Lomake 1', cy);

    jatka(cy);
  });
};

const tallenna = cy => {
  getByTestId('tallennaJaJulkaiseHakuButton', cy).click({ force: true });
};

const fillValintakoeSection = cy => {
  cy.getByTestId('valintakoeSection').within(() => {
    fillValintakoeFields({ cy });
    jatka(cy);
  });
};

const fillYhteystiedotSection = cy => {
  cy.getByTestId('yhteystiedotSection').within(() => {
    fillYhteyshenkilotFields({ cy });
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

    fillPohjaSection(cy);
    fillKieliversiotSection(cy);
    fillNimiSection(cy);
    fillKohdejoukkoSection(cy);
    fillHakutapaSection(cy);
    fillAikatauluSection(cy);
    fillHakulomakeSection(cy);
    fillValintakoeSection(cy);
    fillYhteystiedotSection(cy);

    tallenna(cy);

    cy.wait('@createHakuRequest').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });

    cy.location('pathname').should(
      'eq',
      `/kouta/haku/${createdHakuOid}/muokkaus`,
    );
  });
});
