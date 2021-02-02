import {
  getRadio,
  fillDateTimeInput,
  fillKieliversiotSection,
  selectOption,
  fillYhteyshenkilotFields,
  getByTestId,
  jatka,
  paste,
  fillPohjaSection,
  fillTilaSection,
  tallenna,
  typeToEditor,
  fillAjankohtaFields,
} from '#/cypress/utils';

import { stubHakuFormRoutes } from '#/cypress/hakuFormUtils';

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

const fillAikatauluSection = () => {
  getByTestId('aikataulutSection').within(() => {
    getByTestId('hakuajat').within(() => {
      lisaa();

      getByTestId('alkaa').within(() => {
        fillDateTimeInput({
          date: '02.04.2019',
          time: '10:45',
        });
      });

      getByTestId('paattyy').within(() => {
        fillDateTimeInput({
          date: '25.11.2019',
          time: '23:59',
        });
      });
    });

    getByTestId('tulevaisuudenaikataulu').within(() => {
      lisaa();

      getByTestId('alkaa').within(() => {
        fillDateTimeInput({
          date: '11.10.2019',
          time: '09:05',
        });
      });

      getByTestId('paattyy').within(() => {
        fillDateTimeInput({
          date: '25.12.2019',
          time: '20:30',
        });
      });
    });

    fillAjankohtaFields();

    getByTestId('perumisenTakaraja').within(() => {
      fillDateTimeInput({
        date: '24.12.2019',
        time: '21:20',
      });
    });

    getByTestId('muokkauksenTakaraja').within(() => {
      fillDateTimeInput({
        date: '11.12.2019',
        time: '19:15',
      });
    });

    getByTestId('julkaisupaivamaara').within(() => {
      fillDateTimeInput({
        date: '05.12.2019',
        time: '06:45',
      });
    });

    jatka();
  });
};

const fillHakulomakeSection = (type: string = 'ataru') => {
  getByTestId('hakulomakeSection').within(() => {
    if (type === 'ataru') {
      getRadio(type).click({ force: true });
      selectOption('Lomake 1');
    } else if (type === 'muu') {
      getRadio(type).click({ force: true });
      cy.get(`input[type="text"]`).click().pipe(paste('http://example.com'));
    } else if (type === 'ei sähköistä') {
      getRadio(type).click({ force: true });
      typeToEditor('hakulomake kuvaus');
    }
    jatka();
  });
};

const fillYhteystiedotSection = () => {
  getByTestId('yhteyshenkilotSection').within(() => {
    fillYhteyshenkilotFields();
    jatka();
  });
};

export const createHakuForm = () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const createdHakuOid = '1.2.3.4.5.6';

  beforeEach(() => {
    stubHakuFormRoutes({ organisaatioOid });

    cy.visit(`/organisaatio/${organisaatioOid}/haku`);
  });

  it('should be able to create haku with ataru hakulomake', () => {
    cy.intercept(
      {
        method: 'PUT',
        url: '**/haku',
      },
      {
        oid: createdHakuOid,
      }
    ).as('createHakuRequest');

    fillPohjaSection();
    fillKieliversiotSection({ jatka: true });
    fillNimiSection();
    fillKohdejoukkoSection();
    fillHakutapaSection();
    fillAikatauluSection();
    fillHakulomakeSection('ataru');
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

  it('should be able to create haku with muu hakulomake', () => {
    cy.intercept(
      { method: 'PUT', url: '**/haku' },
      {
        body: {
          oid: createdHakuOid,
        },
      }
    ).as('createHakuRequest');

    fillPohjaSection();
    fillKieliversiotSection({ jatka: true });
    fillNimiSection();
    getByTestId('hakulomakeSection').click();
    fillHakulomakeSection('muu');

    tallenna();

    cy.wait('@createHakuRequest').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });

  it('should be able to create haku with "ei sähköistä" hakulomake', () => {
    cy.intercept(
      { method: 'PUT', url: '**/haku' },
      {
        body: {
          oid: createdHakuOid,
        },
      }
    ).as('createHakuRequest');

    fillPohjaSection();
    fillKieliversiotSection({ jatka: true });
    fillNimiSection();
    getByTestId('hakulomakeSection').click();
    fillHakulomakeSection('ei sähköistä');

    tallenna();

    cy.wait('@createHakuRequest').then(({ request }) => {
      cy.wrap(request.body).toMatchSnapshot();
    });
  });
};
