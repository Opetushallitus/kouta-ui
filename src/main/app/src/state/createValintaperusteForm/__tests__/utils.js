import { getValintaperusteByValues, getValuesByValintaperuste } from '../utils';
import { parse as parseEditor } from '../../../components/Editor';

test('getValintaperusteByValues returns correct valintaperuste given form values', () => {
  const valintaperuste = getValintaperusteByValues({
    kieliversiot: {
      languages: ['fi', 'sv'],
    },
    hakutavanRajaus: {
      hakutapa: 'tapa_1#1',
    },
    kohdejoukonRajaus: {
      kohdejoukko: { value: 'joukko_1#1' },
    },
    nimi: {
      nimi: {
        fi: 'Fi nimi',
        sv: 'Sv nimi',
      },
    },
    loppukuvaus: {
      kuvaus: {
        fi: parseEditor('<h1>Fi kuvaus</h1>'),
        sv: parseEditor('<h1>Sv kuvaus</h2>'),
      },
    },
    osaamistausta: {
      osaamistausta: [{ value: 'tausta_1#1' }, { value: 'tausta_2#1' }],
    },
    kielitaitovaatimukset: {
      kielet: [
        {
          kieli: { value: 'kieli_1#1' },
          tyyppi: {
            'tyyppi_1#1': true,
            'tyyppi_2#1': true,
            'tyyppi_3#1': false,
          },
          kuvaukset: {
            'tyyppi_1#1': [
              {
                kuvaus: { value: 'kuvaus_1#1' },
                taso: 'erinomainen',
              },
            ],
            'tyyppi_2#1': [
              {
                kuvaus: { value: 'kuvaus_2#1' },
                taso: 'ok',
              },
            ],
          },
          osoitustavat: ['osoitustapa_1#1', 'osoitustapa_2#1'],
          muutOsoitustavat: [
            {
              kuvaus: {
                fi: 'Fi kuvaus',
                sv: 'Sv kuvaus',
              },
            },
          ],
        },
      ],
    },
    valintatapa: {
      valintatavat: [
        {
          kuvaus: {
            fi: 'Fi kuvaus',
            sv: 'Sv kuvaus',
          },
          nimi: {
            fi: 'Fi nimi',
            sv: 'Sv nimi',
          },
          kynnysehto: {
            fi: 'Fi kynnysehto',
            sv: 'Sv kynnysehto',
          },
          tapa: { value: 'tapa_1#1' },
          enimmaispistemaara: 20,
          vahimmaispistemaara: 10,
          sisalto: [
            {
              tyyppi: 'teksti',
              data: {
                fi: parseEditor('<h2>Fi sisalto</h2>'),
                sv: parseEditor('<h2>Sv sisalto</h2>'),
              },
            },
            {
              tyyppi: 'taulukko',
              data: {
                rows: [
                  {
                    columns: [
                      { text: { fi: 'Fi column1', sv: 'Sv column1' } },
                      { text: { fi: 'Fi column2', sv: 'Sv column2' } },
                    ],
                  },
                  {
                    columns: [
                      { text: { fi: 'Fi column3', sv: 'Sv column3' } },
                      { text: { fi: 'Fi column4', sv: 'Sv column4' } },
                    ],
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    tyyppi: {
      tyyppi: 'tyyppi_1#1',
    },
    soraKuvaus: {
      value: 'sora_1',
    },
  });

  expect(valintaperuste).toMatchSnapshot();
});

test('getValuesByValintaperuste returns correct form values given valintaperuste', () => {
  const values = getValuesByValintaperuste({
    hakutapaKoodiUri: 'tapa_1#1',
    kielivalinta: ['fi', 'sv'],
    kohdejoukkoKoodiUri: 'joukko_1#1',
    koulutustyyppi: 'tyyppi_1#1',
    metadata: {
      kielitaitovaatimukset: [
        {
          kieliKoodiUri: 'kieli_1#1',
          kielitaidonVoiOsoittaa: [
            {
              kielitaitoKoodiUri: 'osoitustapa_1#1',
              lisatieto: {},
            },
            {
              kielitaitoKoodiUri: 'osoitustapa_2#1',
              lisatieto: {},
            },
            {
              kielitaitoKoodiUri: 'kielitaidonosoittaminen_04#1',
              lisatieto: {
                fi: 'Fi kuvaus',
                sv: 'Sv kuvaus',
              },
            },
          ],
          vaatimukset: [
            {
              kielitaitovaatimusKoodiUri: 'tyyppi_1#1',
              kielitaitovaatimusKuvaukset: [
                {
                  kielitaitovaatimusKuvausKoodiUri: 'kuvaus_1#1',
                  kielitaitovaatimusTaso: 'erinomainen',
                },
              ],
            },
            {
              kielitaitovaatimusKoodiUri: 'tyyppi_2#1',
              kielitaitovaatimusKuvaukset: [
                {
                  kielitaitovaatimusKuvausKoodiUri: 'kuvaus_2#1',
                  kielitaitovaatimusTaso: 'ok',
                },
              ],
            },
          ],
        },
      ],
      koulutustyyppi: 'tyyppi_1#1',
      kuvaus: {
        fi: '<h1>Fi kuvaus</h1>',
        sv: '<h1>Sv kuvaus</h1>',
      },
      osaamistaustaKoodiUrit: ['tausta_1#1', 'tausta_2#1'],
      valintatavat: [
        {
          enimmaispisteet: 20,
          kaytaMuuntotaulukkoa: false,
          kuvaus: {
            fi: 'Fi kuvaus',
            sv: 'Sv kuvaus',
          },
          kynnysehto: {
            fi: 'Fi kynnysehto',
            sv: 'Sv kynnysehto',
          },
          nimi: {
            fi: 'Fi nimi',
            sv: 'Sv nimi',
          },
          sisalto: [
            {
              data: {
                fi: '<h2>Fi sisalto</h2>',
                sv: '<h2>Sv sisalto</h2>',
              },
              tyyppi: 'teksti',
            },
            {
              data: {
                rows: [
                  {
                    columns: [
                      {
                        index: 0,
                        text: {
                          fi: 'Fi column1',
                          sv: 'Sv column1',
                        },
                      },
                      {
                        index: 1,
                        text: {
                          fi: 'Fi column2',
                          sv: 'Sv column2',
                        },
                      },
                    ],
                    index: 0,
                  },
                  {
                    columns: [
                      {
                        index: 0,
                        text: {
                          fi: 'Fi column3',
                          sv: 'Sv column3',
                        },
                      },
                      {
                        index: 1,
                        text: {
                          fi: 'Fi column4',
                          sv: 'Sv column4',
                        },
                      },
                    ],
                    index: 1,
                  },
                ],
              },
              tyyppi: 'taulukko',
            },
          ],
          vahimmaispisteet: 10,
          valintatapaKoodiUri: 'tapa_1#1',
        },
      ],
      soraKuvausId: 'sora_1',
    },
    nimi: {
      fi: 'Fi nimi',
      sv: 'Sv nimi',
    },
  });

  expect(values).toMatchSnapshot();
});
