import {
  getByTestId,
  getRadio,
  getSelectOption,
  fillDateTimeInput,
  chooseKieliversiotLanguages,
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
  getByTestId('kohdejoukkoSection', cy).within(() => {
    getRadio('haunkohdejoukko_0#1', cy).click({ force: true });

    jatka(cy);
  });
};

const fillHakutapaSection = cy => {
  getByTestId('hakutapaSection', cy).within(() => {
    getRadio('hakutapa_0#1', cy).click({ force: true });

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
    jatka(cy);
  });
};

const tallenna = cy => {
  getByTestId('tallennaJaJulkaiseHakuButton', cy).click({ force: true });
};

const fillYhteystiedotSection = cy => {
  getByTestId('yhteystiedotSection', cy).within(() => {
    getByTestId('nimi', cy)
      .find('input')
      .type('nimi', { force: true });
    getByTestId('titteli', cy)
      .find('input')
      .type('titteli', { force: true });
    getByTestId('sahkoposti', cy)
      .find('input')
      .type('sähkoposti', { force: true });
    getByTestId('puhelin', cy)
      .find('input')
      .type('puhelin', { force: true });
  });
};

describe('createHakuForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';

  beforeEach(() => {
    stubHakuFormRoutes({ cy, organisaatioOid });

    cy.visit(`/organisaatio/${organisaatioOid}/haku`);
  });

  it('should be able to create haku', () => {
    cy.route({
      method: 'PUT',
      url: '**/haku',
      response: {
        oid: '1.2.3.4.5.6',
      },
    }).as('createHakuRequest');

    fillPohjaSection(cy);
    fillKieliversiotSection(cy);
    fillNimiSection(cy);
    fillKohdejoukkoSection(cy);
    fillHakutapaSection(cy);
    fillAikatauluSection(cy);
    fillHakulomakeSection(cy);
    fillYhteystiedotSection(cy);

    tallenna(cy);

    cy.wait('@createHakuRequest').then(({ request }) => {
      expect(request.body).to.deep.equal({
        organisaatioOid: '1.1.1.1.1.1',
        muokkaaja: '1.2.246.562.24.62301161440',
        tila: 'julkaistu',
        alkamiskausiKoodiUri: 'kausi_0#1',
        kielivalinta: ['fi'],
        hakutapaKoodiUri: 'hakutapa_0#1',
        hakuajat: [{ alkaa: '2019-04-02T10:45', paattyy: '2019-11-25T23:59' }],
        hakukohteenLiittamisenTakaraja: '2019-12-24T21:20',
        nimi: { fi: 'haun nimi' },
        kohdejoukkoKoodiUri: 'haunkohdejoukko_0#1',
        kohdejoukonTarkenneKoodiUri: null,
        hakulomaketyyppi: null,
        metadata: {
          tulevaisuudenAikataulu: [
            { alkaa: '2019-10-11T09:05', paattyy: '2019-12-25T20:30' },
          ],
          yhteystieto: {
            nimi: { fi: 'nimi' },
            titteli: { fi: 'titteli' },
            sahkoposti: { fi: 'sähkoposti' },
            puhelinnumero: { fi: 'puhelin' },
          },
        },
        hakukohteenMuokkaamisenTakaraja: '2019-12-11T19:15',
        ajastettuJulkaisu: '2019-12-05T06:45',
        alkamisvuosi: 2019,
        hakulomake: null,
      });
    });
  });
});
