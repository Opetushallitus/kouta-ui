import getFormValuesByValintaperuste from '../getFormValuesByValintaperuste';

test('getFormValuesByValintaperuste returns correct form values given valintaperuste', () => {
  const values = getFormValuesByValintaperuste({
    tila: 'tallennettu',
    hakutapaKoodiUri: 'tapa_1#1',
    kielivalinta: ['fi', 'sv'],
    kohdejoukkoKoodiUri: 'joukko_1#1',
    koulutustyyppi: 'tyyppi_1#1',
    onkoJulkinen: true,
    sorakuvausId: 'sora_1',
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
    },
    nimi: {
      fi: 'Fi nimi',
      sv: 'Sv nimi',
    },
    valintakokeet: [
      {
        tyyppiKoodiUri: 'tyyppi_1#1',
        tilaisuudet: [
          {
            osoite: {
              osoite: { fi: 'fi osoite', sv: 'sv osoite' },
              postinumeroKoodiUri: 'posti_1#1',
              postitoimipaikka: {
                fi: 'fi posititoimipaikka',
                sv: 'sv posititoimipaikka',
              },
            },
            aika: {
              alkaa: '2019-04-16T08:44',
              paattyy: '2019-04-18T08:44',
            },
            lisatietoja: {
              fi: 'fi lisatietoja',
              sv: 'sv lisatietoja',
            },
          },
        ],
      },
    ],
  });

  expect(values).toMatchSnapshot();
});
