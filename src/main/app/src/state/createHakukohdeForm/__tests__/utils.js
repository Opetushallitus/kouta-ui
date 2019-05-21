import { getHakukohdeByValues, getValuesByHakukohde } from '../utils';
import { HAKULOMAKETYYPPI } from '../../../constants';

test('getHakukohdeByValues returns correct hakukohde given form values', () => {
  const hakukohde = getHakukohdeByValues({
    alkamiskausi: {
      kausi: 'kausi_1#1',
      vuosi: {
        value: '2020',
      },
    },
    kieliversiot: {
      languages: ['fi', 'sv'],
    },
    aloituspaikat: {
      aloituspaikkamaara: '25',
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
      koulutusvaatimukset: [
        { value: 'vaatimus_1#1' },
        { value: 'vaatimus_2#1' },
      ],
    },
    valintaperusteenKuvaus: {
      valintaperuste: {
        value: 'peruste_1#1',
      },
    },
    valintakoe: {
      types: ['koetyyppi_1#1', 'koetyyppi_2#1'],
      kokeet: {
        'koetyyppi_1#1': {
          kokeet: [
            {
              alkaa: '2019-04-17T05:52',
              paattyy: '2019-04-18T05:52',
              lisatietoja: {
                fi: 'Fi lisatieto',
              },
              osoite: {
                fi: 'Fi osoite',
              },
              postinumero: '00940',
              postitoimipaikka: {
                fi: 'Fi postitoimipaikka',
              },
            },
          ],
        },
        'koetyyppi_2#1': {
          kokeet: [],
        },
      },
    },
    liitteet: {
      toimitusosoite: {
        fi: 'Fi osoite',
        sv: 'Sv osoite',
      },
      toimituspostinumero: '00940',
      toimituspostitoimipaikka: {
        fi: 'Fi postitoimipaikka',
        sv: 'Sv postitoimipaikka',
      },
      toimitussahkoposti: 'sahkoposti@kouta.fi',
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
          toimitusaika: '2019-08-17T05:52',
          toimitussahkoposti: 'sahkoposti2@kouta.fi',
          toimitusosoite: {
            fi: 'Fi osoite',
            sv: 'Sv osoite',
          },
          toimituspostinumero: '00610',
          toimituspostitoimipaikka: {
            fi: 'Fi postitoimipaikka',
            sv: 'Sv postitoimipaikka',
          },
        },
      ],
    },
    hakulomake: {
      eriHakulomake: true,
      tyyppi: HAKULOMAKETYYPPI.ATARU,
      lomake: {
        [HAKULOMAKETYYPPI.ATARU]: { value: '12345' },
      },
    },
  });

  expect(hakukohde).toMatchSnapshot();
});

test('getValuesByHakukohde returns correct form values given hakukohde', () => {
  const values = getValuesByHakukohde({
    alkamiskausiKoodiUri: 'kausi_1#1',
    kaytetaanHaunAikataulua: false,
    kielivalinta: ['fi', 'sv'],
    aloituspaikat: 25,
    hakuajat: [{ alkaa: '2019-03-29T12:28', paattyy: '2019-09-29T12:30' }],
    liitteetOnkoSamaToimitusaika: false,
    liitteetOnkoSamaToimitusosoite: false,
    liitteet: [
      {
        kuvaus: {},
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
            postinumero: '00610',
            postitoimipaikka: {
              fi: 'Fi postitoimipaikka',
              sv: 'Sv postitoimipaikka',
            },
          },
          sahkoposti: 'sahkoposti2@kouta.fi',
        },
        tyyppi: 'liitetyyppi_1#1',
      },
    ],
    alkamisvuosi: 2015,
    liitteidenToimitusosoite: {
      osoite: {
        osoite: {
          fi: 'Fi osoite',
          sv: 'Sv osoite',
        },
        postinumero: '00940',
        postitoimipaikka: {
          fi: 'Fi postitoimipaikka',
          sv: 'Sv postitoimipaikka',
        },
      },
      sahkoposti: 'sahkoposti@kouta.fi',
    },
    liitteidenToimitusaika: '2011-12-20T10:30',
    nimi: { fi: 'Fi nimi', sv: 'Sv nimi' },
    toinenAsteOnkoKaksoistutkinto: true,
    valintakokeet: [],
    pohjakoulutusvaatimusKoodiUrit: ['vaatimus_1#1', 'vaatimus_2#1'],
    valintaperuste: 'peruste_1#1',
    ensikertalaisenAloituspaikat: 39,
    hakulomakeId: '12345',
    hakulomaketyyppi: HAKULOMAKETYYPPI.ATARU,
    eriHakulomake: true,
  });

  expect(values).toMatchSnapshot();
});
