import {
  getByTestId,
  getRadio,
  selectOption,
  typeToEditor,
  getTableInput,
  getCheckbox,
  chooseKieliversiotLanguages,
} from '../../utils';

import { stubValintaperusteFormRoutes } from '../../valintaperusteFormUtils';

const jatka = cy => {
  getByTestId('jatkaButton', cy).click({ force: true });
};

const lisaa = cy => {
  getByTestId('lisaaButton', cy).click({ force: true });
};

const tallenna = cy => {
  getByTestId('tallennaJaJulkaiseValintaperusteButton', cy).click({
    force: true,
  });
};

const fillTyyppiSection = (tyyppi, cy) => {
  getByTestId('tyyppiSection', cy).within(() => {
    getRadio(tyyppi, cy).click({ force: true });
    jatka(cy);
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
    jatka(cy);
  });
};

const fillHakutavanRajausSection = cy => {
  getByTestId('hakutavanRajausSection', cy).within(() => {
    getRadio('hakutapa_0#1', cy).click({ force: true });
    jatka(cy);
  });
};

const fillKohdejoukonRajausSection = cy => {
  getByTestId('kohdejoukonRajausSection', cy).within(() => {
    selectOption('haunkohdejoukko_0', cy);
    jatka(cy);
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

const fillOsaamistaustaSection = cy => {
  getByTestId('osaamistaustaSection', cy).within(() => {
    selectOption('osaamistausta_0', cy);
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

const fillKielitaitovaatimuksetSection = cy => {
  getByTestId('kielitaitovaatimuksetSection', cy).within(() => {
    lisaa(cy);

    getByTestId('kielivalinta', cy).within(() => {
      selectOption('kieli_0', cy);
    });

    getByTestId('tyyppivalinta', cy).within(() => {
      getCheckbox('kielitaitovaatimustyypit_0#1', cy).click({ force: true });
    });

    getByTestId('vaatimusKuvaus', cy).within(() => {
      lisaa(cy);

      getByTestId('kuvaus', cy).within(() => {
        selectOption('kielitaitovaatimustyypitkuvaus_0', cy);
      });

      getByTestId('taso', cy)
        .find('input')
        .type('Taso', { force: true });
    });

    getByTestId('osoitusvalinta', cy).within(() => {
      getCheckbox('kielitaidonosoittaminen_0#1', cy).click({ force: true });
    });

    jatka(cy);
  });
};

const fillSoraKuvausSection = (cy, jatkaArg = false) => {
  cy.getByTestId('soraKuvausSection').within(() => {
    selectOption('Sora-kuvaus 1', cy);

    jatkaArg && jatka(cy);
  });
};

describe('createValintaperusteForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';

  beforeEach(() => {
    stubValintaperusteFormRoutes({ cy, organisaatioOid });

    cy.visit(`/organisaatio/${organisaatioOid}/valintaperusteet`);
  });

  it('should be able to create ammatillinen valintaperuste', () => {
    cy.route({
      method: 'PUT',
      url: '**/valintaperuste',
      response: {
        oid: '1.2.3.4.5.6',
      },
    }).as('createValintaperusteRequest');

    fillTyyppiSection('amm', cy);
    fillKieliversiotSection(cy);
    fillPohjaSection(cy);
    fillHakutavanRajausSection(cy);
    fillKohdejoukonRajausSection(cy);
    fillKuvausSection(cy);
    fillValintatapaSection(cy);
    fillKielitaitovaatimuksetSection(cy);
    fillSoraKuvausSection(cy);

    tallenna(cy);

    cy.wait('@createValintaperusteRequest').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });
  });

  it('should be able to create korkeakoulu valintaperuste', () => {
    cy.route({
      method: 'PUT',
      url: '**/valintaperuste',
      response: {
        oid: '1.2.3.4.5.6',
      },
    }).as('createValintaperusteRequest');

    fillTyyppiSection('yo', cy);
    fillKieliversiotSection(cy);
    fillPohjaSection(cy);
    fillHakutavanRajausSection(cy);
    fillKohdejoukonRajausSection(cy);
    fillKuvausSection(cy);
    fillOsaamistaustaSection(cy);
    fillValintatapaSection(cy);
    fillKielitaitovaatimuksetSection(cy);
    fillSoraKuvausSection(cy);

    tallenna(cy);

    cy.wait('@createValintaperusteRequest').then(({ request }) => {
      cy.wrap(request.body).snapshot();
    });
  });
});
