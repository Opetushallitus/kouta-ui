export default () => ({
  oid: '1.2.246.562.13.00000000000000000072',
  organisaatioOid: '1.2.246.562.10.594252633210',
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
    yhteystiedot: [
      {
        postiosoite: {
          osoite: {
            fi: 'Fi osoite',
            sv: 'Sv osoite',
          },
          postinumeroKoodiUri: 'posti_0#2',
        },
        puhelinnumero: {
          fi: '1234',
          sv: '5678',
        },
        sahkoposti: {
          fi: 'fi@sahkoposti.fi',
          sv: 'sv@sahkoposti.sv',
        },
      },
    ],
    wwwSivu: {
      url: {
        fi: 'http://www.verkkosivu.fi',
        sv: 'http://www.verkkosivu.sv',
      },
      nimi: {
        fi: 'Verkkosivu fi',
        sv: 'Verkkosivu sv',
      },
    },
  },
  muokkaaja: '1.1.1.1',
  tila: 'tallennettu',
});
