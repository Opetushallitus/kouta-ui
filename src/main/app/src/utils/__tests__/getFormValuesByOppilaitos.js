import getFormValuesByOppilaitos from '../getFormValuesByOppilaitos';

test('getFormValuesByOppilaitos returns correct form values given oppilaitos', () => {
  const values = getFormValuesByOppilaitos({
    kielivalinta: ['fi', 'sv'],
    tila: 'tallennettu',
    metadata: {
      akatemioita: 1,
      esittely: {
        fi: '<p><em>Fi esittely</em></p>',
        sv: '<p><em>Sv esittely</em></p>',
      },
      kampuksia: 3,
      korkeakouluja: 5,
      opiskelijoita: 100,
      osat: ['1.1.1.1', '1.1.1.2'],
      osoite: {
        osoite: {
          fi: 'Fi osoite',
          sv: 'Sv osoite',
        },
        postinumeroKoodiUri: 'postinumero_1#1',
      },
      puhelinnumero: '123456',
      tiedekuntia: 4,
      tietoaOpiskelusta: [
        {
          otsikkoKoodiUri: 'osio_1#1',
          teksti: {
            fi: 'Fi tiedot',
            sv: 'Sv tiedot',
          },
        },
      ],
      toimipisteita: 9,
      wwwSivu: {
        fi: 'www.verkkosivu.fi',
        sv: 'www.verkkosivu.sv',
      },
      yksikoita: 2,
    },
  });

  expect(values).toMatchSnapshot();
});
