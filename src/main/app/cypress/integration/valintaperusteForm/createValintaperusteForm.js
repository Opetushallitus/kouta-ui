import {
  getRadio,
  selectOption,
  typeToEditor,
  getTableInput,
  getCheckbox,
  chooseKieliversiotLanguages,
  fillKoulutustyyppiSelect,
  fillValintakoeFields,
} from '../../utils';

import { stubValintaperusteFormRoutes } from '../../valintaperusteFormUtils';

const jatka = () => {
  cy.getByTestId('jatkaButton').click({ force: true });
};

const tallenna = () => {
  cy.getByTestId('tallennaValintaperusteButton').click({
    force: true,
  });
};

const fillKoulutustyyppiSection = path => {
  cy.getByTestId('tyyppiSection').within(() => {
    fillKoulutustyyppiSelect(path, cy);
  });
};

const fillPohjaSection = () => {
  cy.getByTestId('pohjaSection').within(() => {
    jatka();
  });
};

const fillKieliversiotSection = () => {
  cy.getByTestId('kieliversiotSection').within(() => {
    chooseKieliversiotLanguages(['fi'], cy);
  });
};

const fillHakutavanRajausSection = () => {
  cy.getByTestId('hakutapaSection').within(() => {
    getRadio('hakutapa_0#1', cy).click({ force: true });
  });
};

const fillKohdejoukonRajausSection = () => {
  cy.getByTestId('kohdejoukkoSection').within(() => {
    selectOption('haunkohdejoukko_0', cy);
  });
};

const lisaaSisaltoa = tyyppi => {
  cy.getByTestId('sisaltoMenuToggle').click({ force: true });

  cy.getByTestId('sisaltoMenu')
    .first()
    .within(() => {
      if (tyyppi === 'teksti') {
        cy.getByTestId('lisaaTekstia').click({ force: true });
      } else if (tyyppi === 'taulukko') {
        cy.getByTestId('lisaaTaulukko').click({ force: true });
      }
    });
};

const fillValintakoeSection = () => {
  cy.getByTestId('valintakoeSection').within(() => {
    fillValintakoeFields();
    jatka();
  });
};

const fillValintatapaSection = () => {
  cy.getByTestId('valintatapaSection').within(() => {
    cy.getByTestId('valintatapalista').within(() => {
      cy.getByTestId('tapa').within(() => {
        selectOption('valintatapajono_0', cy);
      });

      cy.getByTestId('nimi')
        .find('input')
        .type('Valintatavan nimi', { force: true });

      cy.getByTestId('sisalto').within(() => {
        lisaaSisaltoa('teksti', cy);

        typeToEditor('Sisältötekstiä', cy);

        lisaaSisaltoa('taulukko', cy);

        getTableInput(cy)
          .find('textarea')
          .type('Solu', { force: true });
      });

      cy.getByTestId('kynnysehto')
        .find('textarea')
        .type('Kynnysehto');
      cy.getByTestId('enimmaispistemaara')
        .find('input')
        .type('100');
      cy.getByTestId('vahimmaispistemaara')
        .find('input')
        .type('10');
    });

    jatka();
  });
};

const fillKuvausSection = () => {
  cy.getByTestId('kuvausSection').within(() => {
    cy.getByTestId('nimi')
      .find('input')
      .type('Valintaperusteen nimi', { force: true });

    cy.getByTestId('kuvaus').within(() => {
      typeToEditor('Kuvaus', cy);
    });

    jatka();
  });
};

const fillSoraKuvausSection = () => {
  cy.getByTestId('soraKuvausSection').within(() => {
    selectOption('Sora-kuvaus 1', cy);

    jatka();
  });
};

const fillJulkisuusSection = () => {
  cy.getByTestId('julkisuusSection').within(() => {
    getCheckbox(null, cy).check({ force: true });
    jatka();
  });
};

const fillPerustiedotSection = () => {
  cy.getByTestId('perustiedotSection').within(() => {
    fillKoulutustyyppiSection(['korkeakoulutus'], cy);
    fillKieliversiotSection();
    fillHakutavanRajausSection();
    fillKohdejoukonRajausSection();

    jatka();
  });
};

const fillTilaSection = (tila = 'julkaistu') => {
  cy.getByTestId('tilaSection').within(() => {
    getRadio(tila, cy).check({ force: true });
  });
};

describe('createValintaperusteForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const createdValintaperusteId = '1.2.3.4.5.6';

  beforeEach(() => {
    stubValintaperusteFormRoutes({ cy, organisaatioOid });

    cy.visit(`/organisaatio/${organisaatioOid}/valintaperusteet/kielivalinnat`);
  });

  it('should be able to create valintaperuste', () => {
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
      `/kouta/organisaatio/${organisaatioOid}/valintaperusteet/${createdValintaperusteId}/muokkaus`,
    );
  });
});
