import parseEditorState from '../draft/parseEditorState';
import getValintaperusteByFormValues from '../getValintaperusteByFormValues';

test('getValintaperusteByFormValues returns correct valintaperuste given form values', () => {
  const valintaperuste = getValintaperusteByFormValues({
    kieliversiot: ['fi', 'sv'],
    hakutapa: 'tapa_1#1',
    kohdejoukko: { value: 'joukko_1#1' },
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
    osaamistausta: [{ value: 'tausta_1#1' }, { value: 'tausta_2#1' }],
    kielitaitovaatimukset: [
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
    tyyppi: 'tyyppi_1#1',
    soraKuvaus: {
      value: 'sora_1',
    },
    julkinen: true,
  });

  expect(valintaperuste).toMatchSnapshot();
});
