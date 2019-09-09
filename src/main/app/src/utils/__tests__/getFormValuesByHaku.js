import merge from 'lodash/merge';

import getFormValuesByHaku from '../getFormValuesByHaku';

import { HAKULOMAKETYYPPI } from '../../constants';

const baseHaku = {
  tila: 'tallennettu',
  alkamiskausiKoodiUri: 'kausi_1#1',
  kielivalinta: ['fi', 'sv'],
  hakutapaKoodiUri: 'hakutapa_1#1',
  hakuajat: [{ alkaa: '2019-03-29T12:28', paattyy: '2019-09-29T12:30' }],
  hakukohteenLiittamisenTakaraja: '2019-03-29T12:28',
  nimi: {
    fi: 'Fi nimi',
    sv: 'Sv nimi',
  },
  kohdejoukkoKoodiUri: 'kohdejoukko_1#1',
  kohdejoukonTarkenneKoodiUri: 'tarkenne_1#1',
  metadata: {
    tulevaisuudenAikataulu: [
      { alkaa: '2019-02-20T12:28', paattyy: '2019-08-01T12:45' },
    ],
    yhteyshenkilot: [
      {
        nimi: {
          fi: 'Fi nimi',
          sv: 'Sv nimi',
        },
        titteli: { fi: 'Fi titteli', sv: 'Sv titteli' },
        sahkoposti: { fi: 'Fi sähköposti', sv: 'Sv sähköposti' },
        puhelinnumero: { fi: 'Fi puhelinnumero', sv: 'Sv puhelinnumero' },
        wwwSivu: { fi: 'Fi verkkosivu', sv: 'Sv verkkosivu' },
      },
    ],
  },
  hakukohteenMuokkaamisenTakaraja: '2019-03-11T09:45',
  ajastettuJulkaisu: '2020-01-20T05:00',
  alkamisvuosi: 2020,
  hakulomaketyyppi: HAKULOMAKETYYPPI.ATARU,
  hakulomakeAtaruId: '12345',
  valintakokeet: [
    {
      tyyppi: 'tyyppi_1#1',
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
            fi: 'fi lisatietoja',
            sv: 'sv lisatietoja',
          },
        },
      ],
    },
  ],
};

test('getFormValuesByHaku returns correct form values given haku', () => {
  const values = getFormValuesByHaku(baseHaku);

  expect(values).toMatchSnapshot();
});

test('getFormValuesByHaku returns correct form values given different hakulomake variations', () => {
  const valuesMuu = getFormValuesByHaku(
    merge({}, baseHaku, {
      hakulomaketyyppi: HAKULOMAKETYYPPI.MUU,
      hakulomakeLinkki: {
        fi: 'https://google.fi',
      },
    }),
  );

  const valuesEiHakua = getFormValuesByHaku(
    merge({}, baseHaku, {
      hakulomaketyyppi: HAKULOMAKETYYPPI.EI_SAHKOISTA_HAKUA,
      hakulomakeKuvaus: {
        fi: 'kuvaus',
      },
    }),
  );

  expect(valuesMuu).toMatchSnapshot();
  expect(valuesEiHakua).toMatchSnapshot();
});
