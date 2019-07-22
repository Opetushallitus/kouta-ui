import getFormValuesByHakukohde from '../getFormValuesByHakukohde';
import { HAKULOMAKETYYPPI } from '../../constants';

test('getFormValuesByHakukohde returns correct form values given hakukohde', () => {
  const values = getFormValuesByHakukohde({
    alkamiskausiKoodiUri: 'kausi_1#1',
    kaytetaanHaunAikataulua: false,
    kielivalinta: ['fi', 'sv'],
    minAloituspaikat: 25,
    maxAloituspaikat: 35,
    hakuajat: [{ alkaa: '2019-03-29T12:28', paattyy: '2019-09-29T12:30' }],
    liitteetOnkoSamaToimitusaika: false,
    liitteetOnkoSamaToimitusosoite: false,
    liitteet: [
      {
        kuvaus: {
          fi: 'Fi kuvaus',
          sv: 'Sv kuvaus',
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
            postinumero: '00610',
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
        tyyppi: 'liitetyyppi_1#1',
        toimitustapa: 'muu_osoite',
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
      sahkoposti: {
        fi: 'Fi sahkoposti',
        sv: 'Sv sahkoposti',
      },
    },
    liitteidenToimitusaika: '2011-12-20T10:30',
    nimi: { fi: 'Fi nimi', sv: 'Sv nimi' },
    toinenAsteOnkoKaksoistutkinto: true,
    valintakokeet: [
      {
        tyyppi: 'tyyppi_1#1',
        tilaisuudet: [
          {
            osoite: {
              osoite: { fi: 'fi osoite', sv: 'sv osoite' },
              postinumero: '00520',
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
              fi: 'fi lisatietoja',
              sv: 'sv lisatietoja',
            },
          },
        ],
      },
    ],
    pohjakoulutusvaatimusKoodiUrit: ['vaatimus_1#1', 'vaatimus_2#1'],
    valintaperuste: 'peruste_1#1',
    minEnsikertalaisenAloituspaikat: 39,
    maxEnsikertalaisenAloituspaikat: 49,
    hakulomakeId: '12345',
    hakulomaketyyppi: HAKULOMAKETYYPPI.ATARU,
    eriHakulomake: true,
    eriAlkamiskausi: true,
  });

  expect(values).toMatchSnapshot();
});
