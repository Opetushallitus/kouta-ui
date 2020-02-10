module.exports = {
  createOppilaitosForm: {
    'should be able to create oppilaitos': {
      '1': {
        organisaatioOid: '1.1.1.1.1.1',
        oid: '1.1.1.1.1.1',
        tila: 'julkaistu',
        muokkaaja: '1.2.246.562.24.62301161440',
        kielivalinta: ['fi'],
        teemakuva: null,
        metadata: {
          yhteystiedot: {
            osoite: {
              osoite: {
                fi: 'Osoite',
              },
              postinumeroKoodiUri: 'posti_0#2',
            },
            sahkoposti: {
              fi: 'sahkoposti@sahkoposti.fi',
            },
            puhelinnumero: {
              fi: '12345',
            },
            wwwSivu: {
              fi: 'www.verkkosivu.fi',
            },
          },
          esittely: {
            fi: '<p>Esittely</p>',
          },
          tietoaOpiskelusta: [
            {
              otsikkoKoodiUri: 'organisaationkuvaustiedot_0#1',
              teksti: {
                fi: 'Tietoa',
              },
            },
          ],
          opiskelijoita: 1,
          korkeakouluja: 2,
          tiedekuntia: 3,
          kampuksia: 4,
          yksikoita: 5,
          toimipisteita: 6,
          akatemioita: 7,
        },
      },
    },
  },
  __version: '4.0.0',
  editOppilaitosForm: {
    'should be able to edit oppilaitos': {
      '1': {
        organisaatioOid: '1.1.1.1.1.1',
        oid: '1.1.1.1.1.1',
        kielivalinta: ['fi'],
        tila: 'tallennettu',
        teemakuva: null,
        metadata: {
          yhteystiedot: {
            osoite: {
              osoite: {
                fi: 'Fi osoite',
              },
              postinumeroKoodiUri: 'posti_0#2',
            },
            sahkoposti: {
              fi: 'fi@sahkoposti.fi',
            },
            puhelinnumero: {
              fi: '1234',
            },
            wwwSivu: {
              fi: 'www.verkkosivu.fi',
            },
          },
          esittely: {
            fi: '<p><em>Fi esittely</em></p>',
          },
          tietoaOpiskelusta: [
            {
              otsikkoKoodiUri: 'organisaationkuvaustiedot_0#1',
              teksti: {
                fi: 'Fi tiedot',
              },
            },
          ],
          opiskelijoita: 100,
          korkeakouluja: 5,
          tiedekuntia: 4,
          kampuksia: 3,
          yksikoita: 2,
          toimipisteita: 9,
          akatemioita: 1,
        },
        muokkaaja: '1.2.246.562.24.62301161440',
      },
    },
  },
};
