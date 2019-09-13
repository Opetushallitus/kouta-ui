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
      yhteystiedot: {
        osoite: {
          osoite: {
            fi: 'Fi osoite',
            sv: 'Sv osoite',
          },
          postinumeroKoodiUri: 'postinumero_1#1',
        },
        puhelinnumero: {
          fi: '1234',
          sv: '5678',
        },
        sahkoposti: {
          fi: 'fi@sahkoposti.fi',
          sv: 'sv@sahkoposti.sv',
        },
        wwwSivu: {
          fi: 'www.verkkosivu.fi',
          sv: 'www.verkkosivu.sv',
        },
      },
    },
    muokkaaja: '1.1.1.1',
    tila: 'tallennettu',
  });

  expect(values).toMatchSnapshot();
});
