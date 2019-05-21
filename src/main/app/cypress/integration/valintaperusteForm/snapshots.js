module.exports = {
  createValintaperusteForm: {
    'should be able to create ammatillinen valintaperuste': {
      '1': {
        tila: 'julkaistu',
        muokkaaja: '1.2.246.562.24.62301161440',
        organisaatioOid: '1.1.1.1.1.1',
        kielivalinta: ['fi'],
        hakutapaKoodiUri: 'hakutapa_0#1',
        kohdejoukkoKoodiUri: 'haunkohdejoukko_0#1',
        nimi: {
          fi: 'Valintaperusteen nimi',
        },
        koulutustyyppi: 'amm',
        metadata: {
          koulutustyyppi: 'amm',
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
          soraKuvausId: '1',
        },
      },
    },
    'should be able to create korkeakoulu valintaperuste': {
      '1': {
        tila: 'julkaistu',
        muokkaaja: '1.2.246.562.24.62301161440',
        organisaatioOid: '1.1.1.1.1.1',
        kielivalinta: ['fi'],
        hakutapaKoodiUri: 'hakutapa_0#1',
        kohdejoukkoKoodiUri: 'haunkohdejoukko_0#1',
        nimi: {
          fi: 'Valintaperusteen nimi',
        },
        koulutustyyppi: 'yo',
        metadata: {
          koulutustyyppi: 'yo',
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
          kuvaus: {
            fi: '<p>Loppukuvaus</p>',
          },
          soraKuvausId: '1',
        },
      },
    },
  },
  __version: '3.3.0',
  editValintaperusteForm: {
    'should be able to edit ammatillinen valintaperuste': {
      '1': {
        koulutustyyppi: 'amm',
        id: '649adb37-cd4d-4846-91a9-84b58b90f928',
        tila: 'tallennettu',
        hakutapaKoodiUri: 'hakutapa_0#1',
        kohdejoukkoKoodiUri: 'haunkohdejoukko_0#1',
        nimi: {
          fi: 'Valintaperusteen nimi',
        },
        onkoJulkinen: false,
        metadata: {
          koulutustyyppi: 'amm',
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
          kielitaitovaatimukset: [
            {
              kieliKoodiUri: 'kieli_0#1',
              vaatimukset: [
                {
                  kielitaitovaatimusKoodiUri: 'kielitaitovaatimustyypit_0#1',
                  kielitaitovaatimusKuvaukset: [
                    {
                      kielitaitovaatimusTaso: 'hyvä',
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
        organisaatioOid: '1.1.1.1.1.1',
        muokkaaja: '1.2.246.562.24.62301161440',
        kielivalinta: ['fi'],
        modified: '2019-04-03T13:56',
      },
      '2': {
        koulutustyyppi: 'amm',
        id: '649adb37-cd4d-4846-91a9-84b58b90f928',
        tila: 'tallennettu',
        hakutapaKoodiUri: 'hakutapa_0#1',
        kohdejoukkoKoodiUri: 'haunkohdejoukko_0#1',
        nimi: {
          fi: 'Valintaperusteen nimi',
        },
        onkoJulkinen: false,
        metadata: {
          koulutustyyppi: 'amm',
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
          kielitaitovaatimukset: [
            {
              kieliKoodiUri: 'kieli_0#1',
              vaatimukset: [
                {
                  kielitaitovaatimusKoodiUri: 'kielitaitovaatimustyypit_0#1',
                  kielitaitovaatimusKuvaukset: [
                    {
                      kielitaitovaatimusTaso: 'hyvä',
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
          soraKuvausId: null,
        },
        organisaatioOid: '1.1.1.1.1.1',
        muokkaaja: '1.2.246.562.24.62301161440',
        kielivalinta: ['fi'],
        modified: '2019-04-03T13:56',
      },
    },
    'should be able to edit korkeakoulu valintaperuste': {
      '1': {
        koulutustyyppi: 'yo',
        id: '649adb37-cd4d-4846-91a9-84b58b90f928',
        tila: 'tallennettu',
        hakutapaKoodiUri: 'hakutapa_0#1',
        kohdejoukkoKoodiUri: 'haunkohdejoukko_0#1',
        nimi: {
          fi: 'Valintaperusteen nimi',
        },
        onkoJulkinen: false,
        metadata: {
          koulutustyyppi: 'yo',
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
          kielitaitovaatimukset: [
            {
              kieliKoodiUri: 'kieli_0#1',
              vaatimukset: [
                {
                  kielitaitovaatimusKoodiUri: 'kielitaitovaatimustyypit_0#1',
                  kielitaitovaatimusKuvaukset: [
                    {
                      kielitaitovaatimusTaso: 'hyvä',
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
          kuvaus: {
            fi: '<p>Loppukuvaus</p>',
          },
        },
        organisaatioOid: '1.1.1.1.1.1',
        muokkaaja: '1.2.246.562.24.62301161440',
        kielivalinta: ['fi'],
        modified: '2019-04-03T13:56',
      },
      '2': {
        koulutustyyppi: 'yo',
        id: '649adb37-cd4d-4846-91a9-84b58b90f928',
        tila: 'tallennettu',
        hakutapaKoodiUri: 'hakutapa_0#1',
        kohdejoukkoKoodiUri: 'haunkohdejoukko_0#1',
        nimi: {
          fi: 'Valintaperusteen nimi',
        },
        onkoJulkinen: false,
        metadata: {
          koulutustyyppi: 'yo',
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
          kielitaitovaatimukset: [
            {
              kieliKoodiUri: 'kieli_0#1',
              vaatimukset: [
                {
                  kielitaitovaatimusKoodiUri: 'kielitaitovaatimustyypit_0#1',
                  kielitaitovaatimusKuvaukset: [
                    {
                      kielitaitovaatimusTaso: 'hyvä',
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
          kuvaus: {
            fi: '<p>Loppukuvaus</p>',
          },
          soraKuvausId: null,
        },
        organisaatioOid: '1.1.1.1.1.1',
        muokkaaja: '1.2.246.562.24.62301161440',
        kielivalinta: ['fi'],
        modified: '2019-04-03T13:56',
      },
    },
  },
};
