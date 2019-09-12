import getOppilaitosByFormValues from '../getOppilaitosByFormValues';
import parseEditorState from '../draft/parseEditorState';

test('getOppilaitosByFormValues returns correct oppilaitos given form values', () => {
  const oppilaitos = getOppilaitosByFormValues({
    tila: 'tallennettu',
    muokkaaja: '1.1.1.1',
    kieliversiot: ['fi', 'sv'],
    osat: ['1.1.1.1', '1.1.1.2'],
    tietoa: {
      osiot: [{ value: 'osio_1#1' }],
      tiedot: {
        'osio_1#1': {
          fi: 'Fi tiedot',
          sv: 'Sv tiedot',
        },
      },
    },
    esittely: {
      fi: parseEditorState('<i>Fi esittely</i>'),
      sv: parseEditorState('<i>Sv esittely</i>'),
    },
    perustiedot: {
      opiskelijoita: '100',
      korkeakouluja: '5',
      tiedekuntia: '4',
      kampuksia: '3',
      yksikoita: '2',
      toimipisteita: '9',
      akatemioita: '1',
    },
    yhteystiedot: {
      osoite: {
        fi: 'Fi osoite',
        sv: 'Sv osoite',
      },
      postinumero: { value: 'postinumero_1#1' },
      puhelinnumero: {
        fi: '1234',
        sv: '5678',
      },
      sahkoposti: {
        fi: 'fi@sahkoposti.fi',
        sv: 'sv@sahkoposti.sv',
      },
      verkkosivu: {
        fi: 'www.verkkosivu.fi',
        sv: 'www.verkkosivu.sv',
      },
    },
  });

  expect(oppilaitos).toMatchSnapshot();
});
