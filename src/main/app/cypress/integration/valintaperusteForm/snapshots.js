module.exports = {
  editValintaperusteForm: {
    'should be able to edit valintaperuste': {
      '1': {
        koulutustyyppi: 'amm',
        id: '649adb37-cd4d-4846-91a9-84b58b90f928',
        tila: 'tallennettu',
        hakutapaKoodiUri: 'hakutapa_0#1',
        kohdejoukkoKoodiUri: 'haunkohdejoukko_0#1',
        nimi: {
          fi: 'Valintaperusteen nimi',
        },
        julkinen: false,
        sorakuvausId: '1',
        metadata: {
          tyyppi: 'amm',
          valintatavat: [
            {
              kuvaus: {},
              nimi: {
                fi: 'Valintatavan nimi',
              },
              valintatapaKoodiUri: 'valintatapajono_0#1',
              sisalto: [
                {
                  tyyppi: 'teksti',
                  data: {
                    fi: '<p>Tekstia</p>',
                  },
                },
                {
                  tyyppi: 'taulukko',
                  data: {
                    nimi: {},
                    rows: [
                      {
                        index: 0,
                        isHeader: false,
                        columns: [
                          {
                            index: 0,
                            text: {
                              fi: 'Solu',
                            },
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
              kaytaMuuntotaulukkoa: false,
              kynnysehto: {
                fi: 'Kynnysehto',
              },
              enimmaispisteet: 100,
              vahimmaispisteet: 10,
            },
          ],
          kielitaitovaatimukset: [],
          osaamistaustaKoodiUrit: [],
          kuvaus: {
            fi: '<p>Loppukuvaus</p>',
          },
        },
        organisaatioOid: '1.1.1.1.1.1',
        muokkaaja: '1.2.246.562.24.62301161440',
        kielivalinta: ['fi'],
        modified: '2019-04-03T13:56',
        valintakokeet: [
          {
            tyyppiKoodiUri: 'tyyppi_1#1',
            tilaisuudet: [
              {
                osoite: {
                  osoite: {
                    fi: 'fi osoite',
                  },
                  postinumeroKoodiUri: 'posti_00350#1',
                },
                aika: {
                  alkaa: '2019-04-16T08:44',
                  paattyy: '2019-04-18T08:44',
                },
                lisatietoja: {
                  fi: 'fi lisatietoja',
                },
              },
            ],
          },
        ],
        onkoJulkinen: false,
      },
    },
  },
  __version: '3.4.1',
};
