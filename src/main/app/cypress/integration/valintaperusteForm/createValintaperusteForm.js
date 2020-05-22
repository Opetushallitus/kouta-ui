import { merge } from 'lodash';
import {
  getRadio,
  selectOption,
  typeToEditor,
  getTableInput,
  getCheckbox,
  chooseKieliversiotLanguages,
  fillKoulutustyyppiSelect,
  fillValintakoeFields,
  jatka,
  getByTestId,
  paste,
} from '#/cypress/utils';
import valintaperuste from '#/cypress/data/valintaperuste';
import { stubValintaperusteFormRoutes } from '#/cypress/valintaperusteFormUtils';

const tallenna = () => {
  getByTestId('tallennaValintaperusteButton').click({
    force: true,
  });
};

const fillKoulutustyyppiSection = path => {
  getByTestId('tyyppiSection').within(() => {
    fillKoulutustyyppiSelect(path);
  });
};

const fillPohjaSection = () => {
  getByTestId('pohjaSection').within(() => {
    jatka();
  });
};

const fillKieliversiotSection = () => {
  getByTestId('kieliversiotSection').within(() => {
    chooseKieliversiotLanguages(['fi']);
  });
};

const fillHakutavanRajausSection = () => {
  getByTestId('hakutapaSection').within(() => {
    getRadio('hakutapa_0#1').click({ force: true });
  });
};

const fillKohdejoukonRajausSection = () => {
  getByTestId('kohdejoukkoSection').within(() => {
    selectOption('haunkohdejoukko_0');
  });
};

const lisaaSisaltoa = tyyppi => {
  getByTestId('sisaltoMenuToggle').click({ force: true });

  getByTestId('sisaltoMenu')
    .first()
    .within(() => {
      if (tyyppi === 'teksti') {
        getByTestId('lisaaTekstia').click({ force: true });
      } else if (tyyppi === 'taulukko') {
        getByTestId('lisaaTaulukko').click({ force: true });
      }
    });
};

const fillValintakoeSection = () => {
  getByTestId('valintakoeSection').within(() => {
    fillValintakoeFields();
    jatka();
  });
};

const fillValintatapaSection = () => {
  getByTestId('valintatavatSection').within(() => {
    getByTestId('valintatapalista').within(() => {
      getByTestId('tapa').within(() => {
        selectOption('valintatapajono_0');
      });

      getByTestId('nimi').find('input').pipe(paste('Valintatavan nimi'));

      getByTestId('sisalto').within(() => {
        lisaaSisaltoa('teksti');

        typeToEditor('Sisältötekstiä');

        lisaaSisaltoa('taulukko');

        getTableInput()
          .find('textarea')
          .invoke('val', '')
          .trigger('paste', {
            clipboardData: {
              getData: () => 'solu1.1\tsolu1.2\rsolu2.1\tsolu2.2',
            },
          });
      });

      getByTestId('kynnysehto').find('textarea').pipe(paste('Kynnysehto'));
      getByTestId('enimmaispistemaara').find('input').pipe(paste('100'));
      getByTestId('vahimmaispistemaara').find('input').pipe(paste('10'));
    });

    jatka();
  });
};

const fillKuvausSection = () => {
  getByTestId('kuvausSection').within(() => {
    getByTestId('nimi').find('input').pipe(paste('Valintaperusteen nimi'));

    getByTestId('kuvaus').within(() => {
      typeToEditor('Kuvaus');
    });

    jatka();
  });
};

const fillSoraKuvausSection = () => {
  getByTestId('soraKuvausSection').within(() => {
    selectOption('Sora-kuvaus 1');

    jatka();
  });
};

const fillJulkisuusSection = () => {
  getByTestId('julkinenSection').within(() => {
    getCheckbox(null).check({ force: true });
    jatka();
  });
};

const fillPerustiedotSection = () => {
  getByTestId('perustiedotSection').within(() => {
    fillKoulutustyyppiSection(['korkeakoulutus']);
    fillKieliversiotSection();
    fillHakutavanRajausSection();
    fillKohdejoukonRajausSection();

    jatka();
  });
};

const fillTilaSection = (tila = 'julkaistu') => {
  getByTestId('tilaSection').within(() => {
    getRadio(tila).check({ force: true });
  });
};

describe('createValintaperusteForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const createdValintaperusteId = '1.2.3.4.5.6';

  beforeEach(() => {
    cy.server();
    stubValintaperusteFormRoutes({ organisaatioOid });

    cy.visit(`/organisaatio/${organisaatioOid}/valintaperusteet/kielivalinnat`);
  });

  it('should be able to create valintaperuste', () => {
    cy.route({
      method: 'GET',
      url: `**/valintaperuste/${createdValintaperusteId}`,
      response: [
        merge(valintaperuste(), {
          oid: createdValintaperusteId,
        }),
      ],
    });

    cy.route({
      method: 'PUT',
      url: '**/valintaperuste',
      response: {
        id: createdValintaperusteId,
      },
    }).as('createValintaperusteRequest');

    fillPerustiedotSection();
    fillPohjaSection();
    fillKuvausSection();
    fillValintatapaSection();
    fillValintakoeSection();
    fillSoraKuvausSection();
    fillJulkisuusSection();
    fillTilaSection();

    tallenna();

    cy.wait('@createValintaperusteRequest').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });

    cy.location('pathname').should(
      'eq',
      `/kouta/organisaatio/${organisaatioOid}/valintaperusteet/${createdValintaperusteId}/muokkaus`
    );
  });
});
