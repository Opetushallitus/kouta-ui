import { stubHakuFormRoutes } from '#/cypress/hakuFormUtils';
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
  wrapMutationTest,
} from '#/cypress/utils';
import { ENTITY } from '#/src/constants';

const fillNimiSection = () => {
  getByTestId('nimiSection').within(() => {
    cy.findByLabelText(/yleiset.nimi/).pipe(paste('haun nimi'));

    jatka();
  });
};

const fillKohdejoukkoSection = () => {
  getByTestId('kohdejoukkoSection').within(() => {
    getByTestId('kohdejoukko').within(() => {
      getRadio('haunkohdejoukko_12#1').click({ force: true });
    });

    getByTestId('tarkenne').within(() => {
      selectOption('Ammatillinen opettajankoulutus');
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

    cy.findByLabelText('hakulomake.haullaErillinenAloitusajankohta').check({
      force: true,
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
  const hakuOid = '1.2.3.4.5.6';

  beforeEach(() => {
    stubHakuFormRoutes({ organisaatioOid });

    cy.visit(`/organisaatio/${organisaatioOid}/haku`);
  });

  const mutationTest = wrapMutationTest({
    entity: ENTITY.HAKU,
    oid: hakuOid,
  });

  it(
    'should be able to create haku with ataru hakulomake',
    mutationTest(() => {
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
    })
  );

  it(
    'should be able to create haku with muu hakulomake',
    mutationTest(() => {
      fillPohjaSection();
      fillKieliversiotSection({ jatka: true });
      fillNimiSection();
      getByTestId('hakulomakeSection').click();
      fillHakulomakeSection('muu');

      tallenna();
    })
  );

  it(
    'should be able to create haku with "ei sähköistä" hakulomake',
    mutationTest(() => {
      fillPohjaSection();
      fillKieliversiotSection({ jatka: true });
      fillNimiSection();
      getByTestId('hakulomakeSection').click();
      fillHakulomakeSection('ei sähköistä');

      tallenna();
    })
  );
};
