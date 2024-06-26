export default () => {
  return {
    oid: '1.2.246.562.13.00000000000000000072',
    organisaatioOid: '1.2.246.562.10.594252633210',
    kielivalinta: ['fi', 'sv'],
    tila: 'tallennettu',
    metadata: {
      akatemioita: 1,
      esittely: {
        fi: '<p><em>Fi esittely</em></p>',
        sv: '<p><em>Sv esittely</em></p>',
      },
      hakijapalveluidenYhteystiedot: null,
      kampuksia: 3,
      korkeakouluja: 5,
      opiskelijoita: 100,
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
      tiedekuntia: 4,
      tietoaOpiskelusta: [
        {
          otsikkoKoodiUri: 'organisaationkuvaustiedot_0#1',
          teksti: {
            fi: 'Fi tiedot',
            sv: 'Sv tiedot',
          },
        },
      ],
      toimipisteita: 9,
      yksikoita: 2,
    },
    lastModified: 'Wed, 14 Dec 2022 07:28:50 GMT',
    _enrichedData: {
      muokkaajanNimi: 'Anonymisoitu Virkailija',
      organisaatio: {
        oid: '1.2.246.562.13.00000000000000000072',
        nimi: {
          fi: 'Organisaation nimi',
          sv: 'Organisaation nimi sv',
        },
        yhteystiedot: {
          nimi: {
            fi: 'Organisaation nimi',
            sv: 'Organisaation nimi sv',
          },
          postiosoite: {
            osoite: {
              fi: 'Fi osoite',
              sv: 'Sv osoite',
            },
            postinumeroKoodiUri: 'posti_00350#2',
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
      },
    },
  };
};
