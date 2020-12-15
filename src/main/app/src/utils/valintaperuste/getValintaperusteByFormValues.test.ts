import { parseEditorState } from '#/src/components/Editor/utils';
import { getValintaperusteByFormValues } from '#/src/utils/valintaperuste/getValintaperusteByFormValues';

const BASE_VALINTAPERUSTE_FORM_DATA = {
  perustiedot: {
    tyyppi: 'tyyppi_1#1',
    kieliversiot: ['fi', 'sv'],
    hakutapa: 'tapa_1#1',
    kohdejoukko: { value: 'joukko_1#1' },
  },
  kuvaus: {
    nimi: {
      fi: 'Fi nimi',
      sv: 'Sv nimi',
    },
    kuvaus: {
      fi: parseEditorState('<h1>Fi kuvaus</h1>'),
      sv: parseEditorState('<h1>Sv kuvaus</h2>'),
    },
  },
  valintatavat: [{}],
  soraKuvaus: {
    value: 'sora_1',
  },
  julkinen: true,
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
  tila: 'julkaistu',
};

test('Should convert valintaperuste form with valintatapa', () => {
  const data = {
    ...BASE_VALINTAPERUSTE_FORM_DATA,
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
          fi: parseEditorState('<p>Fi kynnysehto</p>'),
          sv: parseEditorState('<p>Sv kynnysehto</p>'),
        },
        tapa: { value: 'tapa_1#1' },
        enimmaispistemaara: 20,
        vahimmaispistemaara: 10,
        sisalto: [
          {
            tyyppi: 'teksti',
            data: {
              fi: parseEditorState('<h2>Fi sisalto</h2>'),
              sv: parseEditorState('<h2>Sv sisalto</h2>'),
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
  };

  const valintaperuste = getValintaperusteByFormValues(data);

  expect(valintaperuste).toMatchSnapshot();
});

test('Should convert valintaperuste form without valintatapa', () => {
  const valintaperuste = getValintaperusteByFormValues({
    ...BASE_VALINTAPERUSTE_FORM_DATA,
    valintatavat: [{}],
  });

  expect(valintaperuste).toMatchSnapshot();
});
