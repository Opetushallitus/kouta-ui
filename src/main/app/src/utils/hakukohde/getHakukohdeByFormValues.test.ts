import { getHakukohdeByFormValues } from './getHakukohdeByFormValues';
import { parseEditorState } from '#/src/components/Editor/utils';
import { HAKULOMAKETYYPPI, LIITTEEN_TOIMITUSTAPA } from '#/src/constants';

test('getHakukohdeByFormValues returns correct hakukohde given form values', () => {
  const hakukohde = getHakukohdeByFormValues({
    tila: 'tallennettu',
    muokkaaja: '1.1.1.1',
    alkamiskausi: {
      eriAlkamiskausi: true,
      kausi: 'kausi_1#1',
      vuosi: {
        value: '2020',
      },
    },
    kieliversiot: ['fi', 'sv'],
    aloituspaikat: {
      aloituspaikkamaara: '45',
      ensikertalaismaara: '29',
    },
    hakuajat: {
      eriHakuaika: true,
      hakuajat: [
        {
          alkaa: '2019-04-17T05:52',
          paattyy: '2019-04-22T05:52',
        },
        {
          alkaa: '2019-05-17T05:52',
          paattyy: '2019-05-18T05:52',
        },
      ],
    },
    perustiedot: {
      nimi: { fi: 'Fi nimi', sv: 'Sv nimi' },
      voiSuorittaaKaksoistutkinnon: true,
    },
    pohjakoulutus: {
      pohjakoulutusvaatimus: [
        { value: 'vaatimus_1#1' },
        { value: 'vaatimus_2#1' },
      ],
      tarkenne: {
        fi: parseEditorState('<strong>Tarkenne fi</strong>'),
        sv: parseEditorState('<strong>Tarkenne sv</strong>'),
      },
    },
    valintaperusteenKuvaus: {
      value: 'peruste_1#1',
    },
    jarjestyspaikkaOid: '2.2.2.2.2',
    valintakokeet: {
      yleisKuvaus: {
        fi: parseEditorState('<p>Yleiskuvaus - fi</p>'),
        sv: parseEditorState('<p>Yleiskuvaus - sv</p>'),
      },
      kokeetTaiLisanaytot: [
        {
          nimi: { fi: 'nimi - fi', sv: 'nimi - sv' },
          tyyppi: {
            value: 'tyyppi_1#1',
          },
          tietoaHakijalle: {
            fi: parseEditorState('<p>Tietoa hakijalle - fi</p>'),
            sv: parseEditorState('<p>Tietoa hakijalle - sv</p>'),
          },
          liittyyEnnakkovalmistautumista: true,
          ohjeetEnnakkovalmistautumiseen: {
            fi: parseEditorState('<p>Ohjeet ennakkovalmistautumiseen - fi</p>'),
            sv: parseEditorState('<p>ohjeet ennakkovalmistautumiseen - sv</p>'),
          },
          erityisjarjestelytMahdollisia: true,
          ohjeetErityisjarjestelyihin: {
            fi: parseEditorState('<p>Ohjeet erityisjärjestelyihin - fi</p>'),
            sv: parseEditorState('<p>Ohjeet erityisjärjestelyihin - sv</p>'),
          },
          tilaisuudet: [
            {
              osoite: { fi: 'fi osoite', sv: 'sv osoite' },
              postinumero: { value: 'posti_1#1' },
              postitoimipaikka: {
                fi: 'fi posititoimipaikka',
                sv: 'sv posititoimipaikka',
              },
              alkaa: '2019-04-16T08:44',
              paattyy: '2019-04-18T08:44',
              lisatietoja: {
                fi: parseEditorState('<p>fi lisatietoja</p>'),
                sv: parseEditorState('<p>sv lisatietoja</p>'),
              },
              jarjestamispaikka: {
                fi: 'jarjestamispaikka - fi',
                sv: 'jarjestamispaikka - sv',
              },
            },
          ],
        },
      ],
    },
    liitteet: {
      toimitustapa: {
        tapa: LIITTEEN_TOIMITUSTAPA.MUU_OSOITE,
        paikka: {
          osoite: {
            fi: 'Fi osoite',
            sv: 'Sv osoite',
          },
          postinumero: { value: 'posti_1#1' },
          postitoimipaikka: {
            fi: 'Fi postitoimipaikka',
            sv: 'Sv postitoimipaikka',
          },
          sahkoposti: {
            fi: 'Fi sahkoposti',
            sv: 'Sv sahkoposti',
          },
        },
      },
      yhteinenToimituspaikka: false,
      yhteinenToimitusaika: false,
      toimitusaika: '2019-04-17T05:52',
      liitteet: [
        {
          tyyppi: { value: 'liitetyyppi_1#1' },
          nimi: {
            fi: 'Fi nimi',
            sv: 'Sv nimi',
          },
          kuvaus: {
            fi: parseEditorState('Fi kuvaus'),
            sv: parseEditorState('Sv kuvaus'),
          },
          toimitusaika: '2019-08-17T05:52',
          toimitustapa: {
            tapa: LIITTEEN_TOIMITUSTAPA.MUU_OSOITE,
            paikka: {
              osoite: {
                fi: 'Fi osoite',
                sv: 'Sv osoite',
              },
              postinumero: { value: 'posti_1#1' },
              postitoimipaikka: {
                fi: 'Fi postitoimipaikka',
                sv: 'Sv postitoimipaikka',
              },
              sahkoposti: {
                fi: 'Fi sahkoposti',
                sv: 'Sv sahkoposti',
              },
            },
          },
        },
      ],
    },
    hakulomake: {
      eriHakulomake: true,
      tyyppi: HAKULOMAKETYYPPI.ATARU,
      lomake: {
        value: '12345',
      },
    },
  });

  expect(hakukohde).toMatchSnapshot();
});
