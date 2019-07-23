import {
  getByTestId,
  getRadio,
  selectOption,
  typeToEditor,
  getTableInput,
  getCheckbox,
  chooseKieliversiotLanguages,
  fillKoulutustyyppiSelect,
} from '../../utils';

import { stubValintaperusteFormRoutes } from '../../valintaperusteFormUtils';

const jatka = cy => {
  getByTestId('jatkaButton', cy).click({ force: true });
};

const tallenna = cy => {
  getByTestId('tallennaJaJulkaiseValintaperusteButton', cy).click({
    force: true,
  });
};

const fillKoulutustyyppiSection = (path, cy) => {
  cy.getByTestId('tyyppiSection').within(() => {
    fillKoulutustyyppiSelect(path, cy);
  });
};

const fillPohjaSection = cy => {
  getByTestId('pohjaSection', cy).within(() => {
    jatka(cy);
  });
};

const fillKieliversiotSection = cy => {
  getByTestId('kieliversiotSection', cy).within(() => {
    chooseKieliversiotLanguages(['fi'], cy);
  });
};

const fillHakutavanRajausSection = cy => {
  getByTestId('hakutapaSection', cy).within(() => {
    getRadio('hakutapa_0#1', cy).click({ force: true });
  });
};

const fillKohdejoukonRajausSection = cy => {
  getByTestId('kohdejoukkoSection', cy).within(() => {
    selectOption('haunkohdejoukko_0', cy);
  });
};

const lisaaSisaltoa = (tyyppi, cy) => {
  getByTestId('sisaltoMenuToggle', cy).click({ force: true });

  getByTestId('sisaltoMenu', cy)
    .first()
    .within(() => {
      if (tyyppi === 'teksti') {
        getByTestId('lisaaTekstia', cy).click({ force: true });
      } else if (tyyppi === 'taulukko') {
        getByTestId('lisaaTaulukko', cy).click({ force: true });
      }
    });
};

const fillValintatapaSection = cy => {
  getByTestId('valintatapaSection', cy).within(() => {
    getByTestId('valintatapalista', cy).within(() => {
      getByTestId('tapa', cy).within(() => {
        selectOption('valintatapajono_0', cy);
      });

      getByTestId('nimi', cy)
        .find('input')
        .type('Valintatavan nimi', { force: true });

      getByTestId('sisalto', cy).within(() => {
        lisaaSisaltoa('teksti', cy);

        typeToEditor('Sisältötekstiä', cy);

        lisaaSisaltoa('taulukko', cy);

        getTableInput(cy)
          .find('textarea')
          .type('Solu', { force: true });
      });

      getByTestId('kynnysehto', cy)
        .find('textarea')
        .type('Kynnysehto');
      getByTestId('enimmaispistemaara', cy)
        .find('input')
        .type('100');
      getByTestId('vahimmaispistemaara', cy)
        .find('input')
        .type('10');
    });

    jatka(cy);
  });
};

const fillKuvausSection = cy => {
  getByTestId('kuvausSection', cy).within(() => {
    cy.getByTestId('nimi')
      .find('input')
      .type('Valintaperusteen nimi', { force: true });

    cy.getByTestId('kuvaus').within(() => {
      typeToEditor('Kuvaus', cy);
    });

    jatka(cy);
  });
};

const fillSoraKuvausSection = cy => {
  cy.getByTestId('soraKuvausSection').within(() => {
    selectOption('Sora-kuvaus 1', cy);

    jatka(cy);
  });
};

const fillJulkisuusSection = cy => {
  cy.getByTestId('julkisuusSection').within(() => {
    getCheckbox(null, cy).check({ force: true });
  });
};

const fillPerustiedotSection = cy => {
  cy.getByTestId('perustiedotSection').within(() => {
    fillKoulutustyyppiSection(['amm'], cy);
    fillKieliversiotSection(cy);
    fillHakutavanRajausSection(cy);
    fillKohdejoukonRajausSection(cy);

    jatka(cy);
  });
};

describe('createValintaperusteForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';

  beforeEach(() => {
    stubValintaperusteFormRoutes({ cy, organisaatioOid });

    cy.visit(`/organisaatio/${organisaatioOid}/valintaperusteet`);
  });

  it('should be able to create valintaperuste', () => {
    cy.route({
      method: 'PUT',
      url: '**/valintaperuste',
      response: {
        oid: '1.2.3.4.5.6',
      },
    }).as('createValintaperusteRequest');

    fillPerustiedotSection(cy);
    fillPohjaSection(cy);
    fillKuvausSection(cy);
    fillValintatapaSection(cy);
    fillSoraKuvausSection(cy);
    fillJulkisuusSection(cy);

    tallenna(cy);

    cy.wait('@createValintaperusteRequest').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });
  });
});
