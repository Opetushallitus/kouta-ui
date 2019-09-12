/*
{
  "kielivalinta": Array [
    "fi",
    "sv",
  ],
  "metadata": Object {
    "esittely": Object {
      "fi": "<p><em>Fi esittely</em></p>",
      "sv": "<p><em>Sv esittely</em></p>",
    },
    "kampus": Object {
      "fi": "Fi kampus",
      "sv": "Sv kampus",
    },
    "opiskelijoita": 100,
    "osoite": Object {
      "osoite": Object {
        "fi": "Fi osoite",
        "sv": "Sv osoite",
      },
      "postinumeroKoodiUri": "postinumero_1#1",
    },
    "puhelinnumero": "123456",
    "wwwSivu": Object {
      "fi": "www.verkkosivu.fi",
      "sv": "www.verkkosivu.sv",
    },
  },
  "muokkaaja": "1.1.1.1",
  "tila": "tallennettu",
}
*/

import getFormValuesByOppilaitoksenOsa from '../getFormValuesByOppilaitoksenOsa';

test('getFormValuesByOppilaitoksenOsa returns correct form values given oppilaitoksen osa', () => {
  const values = getFormValuesByOppilaitoksenOsa({
    kielivalinta: ['fi', 'sv'],
    metadata: {
      esittely: {
        fi: '<p><em>Fi esittely</em></p>',
        sv: '<p><em>Sv esittely</em></p>',
      },
      kampus: {
        fi: 'Fi kampus',
        sv: 'Sv kampus',
      },
      opiskelijoita: 100,
      osoite: {
        osoite: {
          fi: 'Fi osoite',
          sv: 'Sv osoite',
        },
        postinumeroKoodiUri: 'postinumero_1#1',
      },
      puhelinnumero: '123456',
      wwwSivu: {
        fi: 'www.verkkosivu.fi',
        sv: 'www.verkkosivu.sv',
      },
    },
    muokkaaja: '1.1.1.1',
    tila: 'tallennettu',
  });

  expect(values).toMatchSnapshot();
});
