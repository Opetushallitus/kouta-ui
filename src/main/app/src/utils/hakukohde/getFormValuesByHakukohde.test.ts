import { getFormValuesByHakukohde } from '#/src/utils/hakukohde/getFormValuesByHakukohde';
import { HAKULOMAKETYYPPI, LIITTEEN_TOIMITUSTAPA } from '#/src/constants';

test('getFormValuesByHakukohde returns correct form values given hakukohde', () => {
  const values = getFormValuesByHakukohde({
    tila: 'tallennettu',
    alkamiskausiKoodiUri: 'kausi_1#1',
    kaytetaanHaunAikataulua: false,
    kielivalinta: ['fi', 'sv'],
    aloituspaikat: 35,
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
    alkamisvuosi: 2015,
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
        },
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
    ensikertalaisenAloituspaikat: 39,
    hakulomakeAtaruId: '12345',
    hakulomaketyyppi: HAKULOMAKETYYPPI.ATARU,
    eriHakulomakeKuinHaulla: true,
    eriAlkamiskausi: true,
  });

  expect(values).toMatchSnapshot();
});
