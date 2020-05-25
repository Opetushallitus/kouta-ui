import {
  getRadio,
  getSelectOption,
  fillDateTimeInput,
  chooseKieliversiotLanguages,
  selectOption,
  fillYhteyshenkilotFields,
  getByTestId,
  jatka,
  paste,
} from '#/cypress/utils';

import { stubHakuFormRoutes } from '#/cypress/hakuFormUtils';

const fillPohjaSection = () => {
  getByTestId('pohjaSection').within(() => {
    jatka();
  });
};

const fillTilaSection = (tila = 'julkaistu') => {
  getByTestId('tilaSection').within(() => {
    getRadio(tila).check({ force: true });
  });
};

const fillKieliversiotSection = () => {
  getByTestId('kieliversiotSection').within(() => {
    chooseKieliversiotLanguages(['fi']);
    jatka();
  });
};

const fillNimiSection = () => {
  getByTestId('nimiSection').within(() => {
    cy.get('input').pipe(paste('haun nimi'));

    jatka();
  });
};

const fillKohdejoukkoSection = () => {
  getByTestId('kohdejoukkoSection').within(() => {
    getByTestId('kohdejoukko').within(() => {
      getRadio('haunkohdejoukko_12#1').click({ force: true });
    });

    getByTestId('tarkenne').within(() => {
      selectOption('haunkohdejoukontarkenne_0');
    });

    jatka();
  });
};

const fillHakutapaSection = () => {
  getByTestId('hakutapaSection').within(() => {
    getRadio('hakutapa_01#1').click({ force: true });

    jatka();
  });
};

const lisaa = () => {
  getByTestId('lisaaButton').click({ force: true });
};

const fillDatetime = ({ date, time }) => {
  fillDateTimeInput({ date, time });
};

const fillAikatauluSection = () => {
  getByTestId('aikataulutSection').within(() => {
    getByTestId('hakuajat').within(() => {
      lisaa();

      getByTestId('alkaa').within(() => {
        fillDatetime({
          date: '02.04.2019',
          time: '10:45',
        });
      });

      getByTestId('paattyy').within(() => {
        fillDatetime({
          date: '25.11.2019',
          time: '23:59',
        });
      });
    });

    getByTestId('tulevaisuudenaikataulu').within(() => {
      lisaa();

      getByTestId('alkaa').within(() => {
        fillDatetime({
          date: '11.10.2019',
          time: '09:05',
        });
      });

      getByTestId('paattyy').within(() => {
        fillDatetime({
          date: '25.12.2019',
          time: '20:30',
        });
      });
    });

    getByTestId('alkamiskausi').within(() => {
      getRadio('kausi_0#1').click({ force: true });

      getByTestId('vuosi').click();

      getByTestId('vuosi').within(() => {
        getSelectOption(new Date().getFullYear().toString()).click({
          force: true,
        });
      });
    });

    getByTestId('perumisenTakaraja').within(() => {
      fillDatetime({
        date: '24.12.2019',
        time: '21:20',
      });
    });

    getByTestId('muokkauksenTakaraja').within(() => {
      fillDatetime({
        date: '11.12.2019',
        time: '19:15',
      });
    });

    getByTestId('julkaisupaivamaara').within(() => {
      fillDatetime({
        date: '05.12.2019',
        time: '06:45',
      });
    });

    jatka();
  });
};

const fillHakulomakeSection = () => {
  getByTestId('hakulomakeSection').within(() => {
    getRadio('ataru').click({ force: true });
    selectOption('Lomake 1');

    jatka();
  });
};

const tallenna = () => {
  getByTestId('tallennaHakuButton').click({ force: true });
};

const fillYhteystiedotSection = () => {
  getByTestId('yhteyshenkilotSection').within(() => {
    fillYhteyshenkilotFields();
    jatka();
  });
};

describe('createHakuForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const createdHakuOid = '1.2.3.4.5.6';

  beforeEach(() => {
    cy.server();
    stubHakuFormRoutes({ organisaatioOid });

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
    fillYhteystiedotSection();
    fillTilaSection();

    tallenna();

    cy.wait('@createHakuRequest').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });

    cy.location('pathname').should(
      'eq',
      `/kouta/organisaatio/${organisaatioOid}/haku/${createdHakuOid}/muokkaus`
    );
  });
});
