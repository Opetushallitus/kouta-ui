import getHakukohdeByFormValues from '../getHakukohdeByFormValues';
import { HAKULOMAKETYYPPI } from '../../constants';

test('getHakukohdeByFormValues returns correct hakukohde given form values', () => {
  const hakukohde = getHakukohdeByFormValues({
    alkamiskausi: {
      eriAlkamiskausi: true,
      kausi: 'kausi_1#1',
      vuosi: {
        value: '2020',
      },
    },
    kieliversiot: ['fi', 'sv'],
    aloituspaikat: {
      minAloituspaikkamaara: '25',
      maxAloituspaikkamaara: '45',
      minEnsikertalaismaara: '29',
      maxEnsikertalaismaara: '49',
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
    pohjakoulutus: [{ value: 'vaatimus_1#1' }, { value: 'vaatimus_2#1' }],
    valintaperusteenKuvaus: {
      value: 'peruste_1#1',
    },
    valintakoe: {
      tyypit: [{ value: 'tyyppi_1#1' }],
      tilaisuudet: {
        'tyyppi_1#1': [
          {
            osoite: { fi: 'fi osoite', sv: 'sv osoite' },
            postinumero: '00520',
            postitoimipaikka: {
              fi: 'fi posititoimipaikka',
              sv: 'sv posititoimipaikka',
            },
            alkaa: '2019-04-16T08:44',
            paattyy: '2019-04-18T08:44',
            lisatietoja: {
              fi: 'fi lisatietoja',
              sv: 'sv lisatietoja',
            },
          },
        ],
      },
    },
    liitteet: {
      toimitustapa: {
        tapa: 'muu_osoite',
        paikka: {
          osoite: {
            fi: 'Fi osoite',
            sv: 'Sv osoite',
          },
          postinumero: '00940',
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
            fi: 'Fi kuvaus',
            sv: 'Sv kuvaus',
          },
          toimitusaika: '2019-08-17T05:52',
          toimitustapa: {
            tapa: 'muu_osoite',
            paikka: {
              osoite: {
                fi: 'Fi osoite',
                sv: 'Sv osoite',
              },
              postinumero: '00940',
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
        [HAKULOMAKETYYPPI.ATARU]: { value: '12345' },
      },
    },
  });

  expect(hakukohde).toMatchSnapshot();
});
