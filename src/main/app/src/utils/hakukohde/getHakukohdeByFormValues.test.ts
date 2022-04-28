import { parseEditorState } from '#/src/components/Editor/utils';
import {
  Alkamiskausityyppi,
  HAKULOMAKETYYPPI,
  JULKAISUTILA,
  LIITTEEN_TOIMITUSTAPA,
} from '#/src/constants';

import { getHakukohdeByFormValues } from './getHakukohdeByFormValues';

test('getHakukohdeByFormValues returns correct hakukohde given form values', () => {
  const hakukohde = getHakukohdeByFormValues({
    externalId: 'ext1',
    uudenOpiskelijanUrl: {
      fi: 'https://opiskelu.fi',
      sv: 'https://opiskelu.se',
    },
    tila: JULKAISUTILA.TALLENNETTU,
    muokkaaja: '1.1.1.1',
    kieliversiot: ['fi', 'sv'],
    aloituspaikat: {
      aloituspaikkamaara: '45',
      ensikertalaismaara: '29',
      aloituspaikkakuvaus: {
        fi: parseEditorState('aloituspaikan kuvaus fi'),
        sv: parseEditorState('aloituspaikan kuvaus sv'),
      },
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
      valintaperuste: { value: 'peruste_1#1' },
      kynnysehto: {
        fi: parseEditorState('<p>Hakukohteen kynnysehto - fi</p>'),
        sv: parseEditorState('<p>Hakukohteen kynnysehto - sv</p>'),
      },
    },
    jarjestyspaikkaOid: '2.2.2.2.2',
    ajankohta: {
      kaytetaanHakukohteenAlkamiskautta: true,
      ajankohtaTyyppi: Alkamiskausityyppi.ALKAMISKAUSI_JA_VUOSI,
      kausi: 'alkamiskausi_1#1',
      vuosi: { value: '2020' },
    },
    valintakokeet: {
      yleisKuvaus: {
        fi: parseEditorState('<p>Yleiskuvaus - fi</p>'),
        sv: parseEditorState('<p>Yleiskuvaus - sv</p>'),
      },
      valintaperusteenValintakokeidenLisatilaisuudet: {
        '123-123': [
          {
            osoite: { fi: 'fi osoite', sv: 'sv osoite' },
            postinumero: { value: 'posti_1#1' },
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
          vahimmaispistemaara: '30,4',
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
            rivi1: {
              fi: 'Fi osoite',
              sv: 'Sv osoite',
            },
            rivi2: {},
          },
          postinumero: { value: 'posti_1#1' },
          sahkoposti: {
            fi: 'Fi sahkoposti',
            sv: 'Sv sahkoposti',
          },
          verkkosivu: 'https://liitelomake.fi',
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
                rivi1: {
                  fi: 'Fi osoite',
                  sv: 'Sv osoite',
                },
                rivi2: {},
              },
              postinumero: { value: 'posti_1#1' },
              sahkoposti: {
                fi: 'Fi sahkoposti',
                sv: 'Sv sahkoposti',
              },
              verkkosivu: 'https://liitelomake.fi',
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
    hakukohteenLinja: {
      linja: 'lukiopainotukset_0104#1',
      alinHyvaksyttyKeskiarvo: '6,5',
      lisatietoa: {
        fi: parseEditorState('Fi lisatietoa'),
        sv: parseEditorState('Sv lisatietoa'),
      },
      painotetutArvosanat: [
        {
          painotettuOppiaine: {
            value: 'painotettavatoppiaineetlukiossa_a1en#1',
            label: 'A1 englanti',
          },
          painokerroin: '1.2',
        },
      ],
    },
  });

  expect(hakukohde).toMatchSnapshot();
});
