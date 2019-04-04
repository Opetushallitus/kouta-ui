import merge from 'lodash/merge';

import {
  getByTestId,
  getRadio,
  stubKoodistoRoute,
  selectOption,
  typeToEditor,
  getTableInput,
  getCheckbox,
} from '../../utils';

import organisaatio from '../../data/organisaatio';

const jatka = cy => {
  getByTestId('jatkaButton', cy).click({ force: true });
};

const lisaa = cy => {
  getByTestId('lisaaButton', cy).click({ force: true });
};

const tallenna = cy => {
  getByTestId('tallennaValintaperusteButton', cy).click({ force: true });
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

const fillNimiSection = cy => {
  getByTestId('nimiSection', cy).within(() => {
    cy.get('input').type('Valintaperusteen nimi', { force: true });
    jatka(cy);
  });
};

const lisaaSisaltoa = (tyyppi, cy) => {
  getByTestId('sisaltoMenuToggle', cy).click({ force: true });

  getByTestId('sisaltoMenu', cy).within(() => {
    if (tyyppi === 'teksti') {
      getByTestId('lisaaTekstia', cy).click({ force: true });
    } else if (tyyppi === 'taulukko') {
      getByTestId('lisaaTaulukko', cy).click({ force: true });
    }
  });
};

const fillValintatapaSection = cy => {
  getByTestId('valintatapaSection', cy).within(() => {
    lisaa(cy);

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
  });
};

describe('createValintaperusteForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';

  beforeEach(() => {
    cy.server();

    cy.route({
      method: 'GET',
      url: `**/organisaatio-service/rest/organisaatio/v4/${organisaatioOid}**`,
      response: merge(organisaatio(), {
        oid: organisaatioOid,
      }),
    });

    stubKoodistoRoute({ koodisto: 'hakutapa', cy });
    stubKoodistoRoute({ koodisto: 'haunkohdejoukko', cy });
    stubKoodistoRoute({ koodisto: 'valintatapajono', cy });
    stubKoodistoRoute({ koodisto: 'kielitaidonosoittaminen', cy });
    stubKoodistoRoute({ koodisto: 'kielitaitovaatimustyypit', cy });
    stubKoodistoRoute({ koodisto: 'kielitaitovaatimustyypitkuvaus', cy });
    stubKoodistoRoute({ koodisto: 'kieli', cy });

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

    fillTyyppiSection('amm', cy);
    fillKieliversiotSection(cy);
    fillPohjaSection(cy);
    fillHakutavanRajausSection(cy);
    fillKohdejoukonRajausSection(cy);
    fillNimiSection(cy);
    fillValintatapaSection(cy);
    fillKielitaitovaatimuksetSection(cy);

    tallenna(cy);

    cy.wait('@createValintaperusteRequest').then(({ request }) => {
      expect(request.body).to.deep.equal({
        tila: 'tallennettu',
        muokkaaja: '1.2.246.562.24.62301161440',
        organisaatioOid: '1.1.1.1.1.1',
        kielivalinta: ['fi', 'sv'],
        hakutapaKoodiUri: 'hakutapa_0#1',
        kohdejoukkoKoodiUri: 'haunkohdejoukko_0#1',
        nimi: { fi: 'Valintaperusteen nimi' },
        koulutustyyppi: 'amm',
        metadata: {
          koulutustyyppi: 'amm',
          valintatavat: [
            {
              kuvaus: {},
              nimi: { fi: 'Valintatavan nimi' },
              valintatapaKoodiUri: 'valintatapajono_0#1',
              sisalto: [
                { tyyppi: 'teksti', data: { fi: '<p>Sisältötekstiä</p>' } },
                {
                  tyyppi: 'taulukko',
                  data: {
                    rows: [
                      {
                        columns: [{ text: { fi: 'Solu' }, index: 0 }],
                        index: 0,
                      },
                    ],
                  },
                },
              ],
              kaytaMuuntotaulukkoa: false,
              kynnysehto: { fi: 'Kynnysehto' },
              enimmaispisteet: 100,
              vahimmaispisteet: 10,
            },
          ],
          kielitaitovaatimukset: [
            {
              kieliKoodiUri: 'kieli_0#1',
              vaatimukset: [
                {
                  kielitaitovaatimusKoodiUri: 'kielitaitovaatimustyypit_0#1',
                  kielitaitovaatimusKuvaukset: [
                    {
                      kielitaitovaatimusTaso: 'Taso',
                      kielitaitovaatimusKuvausKoodiUri:
                        'kielitaitovaatimustyypitkuvaus_0#1',
                    },
                  ],
                },
              ],
              kielitaidonVoiOsoittaa: [
                {
                  kielitaitoKoodiUri: 'kielitaidonosoittaminen_0#1',
                  lisatieto: {},
                },
              ],
            },
          ],
          osaamistaustaKoodiUrit: [],
          kuvaus: {},
        },
      });
    });
  });
});
