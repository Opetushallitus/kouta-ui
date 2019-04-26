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

const fillNimiSection = cy => {
  getByTestId('nimiSection', cy).within(() => {
    cy.get('input').type('Valintaperusteen nimi', { force: true });
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

const fillLoppukuvausSection = cy => {
  getByTestId('loppukuvausSection', cy).within(() => {
    typeToEditor('Loppukuvaus', cy);
  });
};

const fillKielitaitovaatimuksetSection = (cy, jatkaArg = false) => {
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
    fillNimiSection(cy);
    fillValintatapaSection(cy);
    fillKielitaitovaatimuksetSection(cy);

    tallenna(cy);

    cy.wait('@createValintaperusteRequest').then(({ request }) => {
      expect(request.body).to.deep.equal({
        tila: 'julkaistu',
        muokkaaja: '1.2.246.562.24.62301161440',
        organisaatioOid: '1.1.1.1.1.1',
        kielivalinta: ['fi'],
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
    fillNimiSection(cy);
    fillOsaamistaustaSection(cy);
    fillValintatapaSection(cy);
    fillKielitaitovaatimuksetSection(cy, true);
    fillLoppukuvausSection(cy);

    tallenna(cy);

    cy.wait('@createValintaperusteRequest').then(({ request }) => {
      expect(request.body).to.deep.equal({
        tila: 'julkaistu',
        muokkaaja: '1.2.246.562.24.62301161440',
        organisaatioOid: '1.1.1.1.1.1',
        kielivalinta: ['fi'],
        hakutapaKoodiUri: 'hakutapa_0#1',
        kohdejoukkoKoodiUri: 'haunkohdejoukko_0#1',
        nimi: { fi: 'Valintaperusteen nimi' },
        koulutustyyppi: 'yo',
        metadata: {
          koulutustyyppi: 'yo',
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
          osaamistaustaKoodiUrit: ['osaamistausta_0#1'],
          kuvaus: { fi: '<p>Loppukuvaus</p>' },
        },
      });
    });
  });
});
