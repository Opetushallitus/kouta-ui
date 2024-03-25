import { getFormValuesByOppilaitos } from '#/src/utils/oppilaitos/getFormValuesByOppilaitos';

test('getFormValuesByOppilaitos returns correct form values given oppilaitos', () => {
  const values = getFormValuesByOppilaitos({
    kielivalinta: ['fi', 'sv'],
    tila: 'tallennettu',
    metadata: {
      akatemioita: 1,
      jarjestaaUrheilijanAmmKoulutusta: true,
      esittely: {
        fi: '<p><em>Fi esittely</em></p>',
        sv: '<p><em>Sv esittely</em></p>',
      },
      kampuksia: 3,
      korkeakouluja: 5,
      opiskelijoita: 100,
      yhteystiedot: [
        {
          nimi: {
            fi: 'Yhteystiedon nimi',
            sv: 'Yhteystiedon nimi sv',
          },
          postiosoite: {
            osoite: {
              fi: 'Fi osoite',
              sv: 'Sv osoite',
            },
            postinumeroKoodiUri: {
              fi: 'postinumero_1#1',
              sv: 'postinumero_2#1',
            },
          },
          kayntiosoite: {
            osoite: {
              fi: 'Fi osoite',
              sv: 'Sv osoite',
            },
            postinumeroKoodiUri: {
              fi: 'postinumero_1#1',
              sv: 'postinumero_2#1',
            },
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
      hakijapalveluidenYhteystiedot: {
        nimi: {
          fi: 'Hakijapalveluiden nimi',
          sv: 'Hakijapalveluiden nimi sv',
        },
        postiosoite: {
          osoite: {
            fi: 'Fi osoite',
            sv: 'Sv osoite',
          },
          postinumeroKoodiUri: {
            fi: 'postinumero_1#1',
            sv: 'postinumero_2#1',
          },
        },
        kayntiosoite: {
          osoite: {
            fi: 'Fi osoite',
            sv: 'Sv osoite',
          },
          postinumeroKoodiUri: {
            fi: 'postinumero_1#1',
            sv: 'postinumero_2#1',
          },
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
      tiedekuntia: 4,
      tietoaOpiskelusta: [
        {
          otsikkoKoodiUri: 'osio_1#1',
          teksti: {
            fi: '<p>Fi tiedot</p>',
            sv: '<p>Sv tiedot</p>',
          },
        },
      ],
      toimipisteita: 9,
      yksikoita: 2,
      wwwSivu: {
        url: {
          fi: 'www.verkkosivu.fi',
          sv: 'www.verkkosivu.sv',
        },
        nimi: {
          fi: 'Verkkosivu fi',
          sv: 'Verkkosivu sv',
        },
      },
    },
  });

  expect(values).toMatchSnapshot();
});
