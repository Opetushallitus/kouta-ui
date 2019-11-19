module.exports = {
  createValintaperusteForm: {
    'should be able to create valintaperuste': {
      '1': {
        tila: 'julkaistu',
        muokkaaja: '1.2.246.562.24.62301161440',
        kielivalinta: ['fi'],
        hakutapaKoodiUri: 'hakutapa_0#1',
        kohdejoukkoKoodiUri: 'haunkohdejoukko_0#1',
        nimi: {
          fi: 'Valintaperusteen nimi',
        },
        koulutustyyppi: 'amm',
        onkoJulkinen: true,
        valintakokeet: [
          {
            tyyppiKoodiUri: 'valintakokeentyyppi_1#1',
            tilaisuudet: [
              {
                osoite: {
                  osoite: {
                    fi: 'osoite',
                  },
                  postinumeroKoodiUri: 'posti_0#2',
                },
                aika: {
                  alkaa: '2019-04-02T10:45',
                  paattyy: '2019-04-02T19:00',
                },
                lisatietoja: {
                  fi: 'lisatietoja',
                },
              },
            ],
          },
        ],
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
                    fi: '<p>Sisältötekstiä</p>',
                  },
                },
                {
                  tyyppi: 'taulukko',
                  data: {
                    rows: [
                      {
                        columns: [
                          {
                            text: {
                              fi: 'Solu',
                            },
                            index: 0,
                          },
                        ],
                        index: 0,
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
            fi: '<p>Kuvaus</p>',
          },
        },
        organisaatioOid: '1.1.1.1.1.1',
      },
    },
  },
  __version: '3.4.1',
};
