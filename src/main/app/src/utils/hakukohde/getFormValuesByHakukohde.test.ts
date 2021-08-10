import {
  Alkamiskausityyppi,
  HAKULOMAKETYYPPI,
  JULKAISUTILA,
  LIITTEEN_TOIMITUSTAPA,
} from '#/src/constants';
import {
  getFormValuesByHakukohde,
  parseKeskiarvo,
} from '#/src/utils/hakukohde/getFormValuesByHakukohde';

describe('parseKeskiarvo', () => {
  test.each([
    [7, '7,0'],
    [6.9, '6,9'],
    [1.234, '1,234'],
  ])('produces correct output', (number, expected) =>
    expect(parseKeskiarvo(number)).toEqual(expected)
  );
});

test('getFormValuesByHakukohde returns correct form values given hakukohde', () => {
  const values = getFormValuesByHakukohde({
    externalId: 'ext1',
    tila: JULKAISUTILA.TALLENNETTU,
    kielivalinta: ['fi', 'sv'],
    hakuajat: [{ alkaa: '2019-03-29T12:28', paattyy: '2019-09-29T12:30' }],
    liitteetOnkoSamaToimitusaika: false,
    liitteetOnkoSamaToimitusosoite: false,
    liitteet: [
      {
        kuvaus: {
          fi: '<p>Fi kuvaus</p>',
          sv: '<p>Sv kuvaus</p>',
        },
        nimi: {
          fi: 'Fi nimi',
          sv: 'Sv nimi',
        },
        toimitusaika: '2016-10-25T09:45',
        toimitusosoite: {
          osoite: {
            osoite: {
              fi: 'Fi osoite',
              sv: 'Sv osoite',
            },
            postinumeroKoodiUri: 'posti_1#1',
            postitoimipaikka: {
              fi: 'Fi postitoimipaikka',
              sv: 'Sv postitoimipaikka',
            },
          },
          sahkoposti: {
            fi: 'Fi sahkoposti',
            sv: 'Sv sahkoposti',
          },
        },
        tyyppiKoodiUri: 'liitetyyppi_1#1',
        toimitustapa: LIITTEEN_TOIMITUSTAPA.MUU_OSOITE,
      },
    ],
    liitteidenToimitusosoite: {
      osoite: {
        osoite: {
          fi: 'Fi osoite',
          sv: 'Sv osoite',
        },
        postinumeroKoodiUri: 'posti_1#1',
        postitoimipaikka: {
          fi: 'Fi postitoimipaikka',
          sv: 'Sv postitoimipaikka',
        },
      },
      sahkoposti: {
        fi: 'Fi sahkoposti',
        sv: 'Sv sahkoposti',
      },
    },
    liitteidenToimitusaika: '2011-12-20T10:30',
    nimi: { fi: 'Fi nimi', sv: 'Sv nimi' },
    toinenAsteOnkoKaksoistutkinto: true,
    metadata: {
      valintakokeidenYleiskuvaus: {
        fi: '<p>Yleiskuvaus - fi</p>',
        sv: '<p>Yleiskuvaus - sv</p>',
      },
      valintaperusteenValintakokeidenLisatilaisuudet: [
        {
          id: '123-123',
          tilaisuudet: [
            {
              jarjestamispaikka: {
                fi: 'fi jarjestamispaikka',
                sv: 'sv jarjestamispaikka',
              },
              osoite: {
                osoite: { fi: 'fi osoite', sv: 'sv osoite' },
                postinumeroKoodiUri: 'posti_1#1',
                postitoimipaikka: {
                  fi: 'fi postitoimipaikka',
                  sv: 'sv postitoimipaikka',
                },
              },
              aika: {
                alkaa: '2019-04-16T08:44',
                paattyy: '2019-04-18T08:44',
              },
              lisatietoja: {
                fi: '<p>fi lisatietoja</p>',
                sv: '<p>sv lisatietoja</p>',
              },
            },
          ],
        },
      ],
      kynnysehto: {
        fi: '<p>Hakukohteen kynnysehto - fi</p>',
        sv: '<p>Hakukohteen kynnysehto - sv</p>',
      },
      kaytetaanHaunAlkamiskautta: false,
      koulutuksenAlkamiskausi: {
        alkamiskausityyppi: Alkamiskausityyppi.TARKKA_ALKAMISAJANKOHTA,
        koulutuksenAlkamiskausiKoodiUri: 'kausi_k#1',
        koulutuksenAlkamispaivamaara: '2021-04-16T00:00',
        koulutuksenPaattymispaivamaara: '2021-12-12T00:00',
        koulutuksenAlkamisvuosi: 2020,
      },
      aloituspaikat: {
        lukumaara: 45,
        ensikertalaisille: 35,
        kuvaus: {
          fi: '<p>Aloituspaikan kuvaus - fi</p>',
          sv: '<p>Aloituspaikan kuvaus - sv</p>',
        },
      },
      hakukohteenLinja: {
        linja: 'lukiopainotukset_0104#1',
        alinHyvaksyttyKeskiarvo: 6.5,
        lisatietoa: {
          fi: '<p>Fi lisatietoa</p>',
          sv: '<p>Sv lisatietoa</p>',
        },
      },
    },
    jarjestyspaikkaOid: '2.2.2.2.2',
    valintakokeet: [
      {
        nimi: {
          fi: 'valintakokeen nimi - fi',
          sv: 'valintakokeen nimi - sv',
        },
        tyyppiKoodiUri: 'tyyppi_1#1',
        metadata: {
          tietoja: {
            fi: '<p>Tietoa hakijalle - fi</p>',
            sv: '<p>Tietoa hakijalle - sv</p>',
          },
          liittyyEnnakkovalmistautumista: true,
          ohjeetEnnakkovalmistautumiseen: {
            fi: '<p>Ohjeet ennakkovalmistautumiseen - fi</p>',
            sv: '<p>ohjeet ennakkovalmistautumiseen - sv</p>',
          },
          erityisjarjestelytMahdollisia: true,
          ohjeetErityisjarjestelyihin: {
            fi: '<p>Ohjeet erityisjärjestelyihin - fi</p>',
            sv: '<p>Ohjeet erityisjärjestelyihin - sv</p>',
          },
          vahimmaispisteet: 30.3,
        },
        tilaisuudet: [
          {
            osoite: {
              osoite: { fi: 'fi osoite', sv: 'sv osoite' },
              postinumeroKoodiUri: 'posti_1#1',
              postitoimipaikka: {
                fi: 'fi postitoimipaikka',
                sv: 'sv postitoimipaikka',
              },
            },
            aika: {
              alkaa: '2019-04-16T08:44',
              paattyy: '2019-04-18T08:44',
            },
            lisatietoja: {
              fi: '<p>fi lisatietoja</p>',
              sv: '<p>sv lisatietoja</p>',
            },
          },
        ],
      },
    ],
    pohjakoulutusvaatimusKoodiUrit: ['vaatimus_1#1', 'vaatimus_2#1'],
    pohjakoulutusvaatimusTarkenne: {
      fi: '<strong>Tarkenne fi</strong>',
      sv: '<strong>Tarkenne sv</strong>',
    },
    valintaperusteId: 'peruste_1#1',
    hakulomakeAtaruId: '12345',
    hakulomaketyyppi: HAKULOMAKETYYPPI.ATARU,
    eriHakulomakeKuinHaulla: true,
  });

  expect(values).toMatchSnapshot();
});
