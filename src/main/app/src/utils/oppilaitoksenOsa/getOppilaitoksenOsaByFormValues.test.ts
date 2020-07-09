import getOppilaitoksenOsaByFormValues from '#/src/utils/oppilaitoksenOsa/getOppilaitoksenOsaByFormValues';
import { parseEditorState } from '#/src/components/Editor/utils';

test('getOppilaitoksenOsaByFormValues returns correct oppilaitoksen osa given form values', () => {
  const oppilaitos = getOppilaitoksenOsaByFormValues({
    tila: 'tallennettu',
    muokkaaja: '1.1.1.1',
    kieliversiot: ['fi', 'sv'],
    esittely: {
      fi: parseEditorState('<i>Fi esittely</i>'),
      sv: parseEditorState('<i>Sv esittely</i>'),
    },
    perustiedot: {
      opiskelijoita: '100',
      kampus: {
        fi: 'Fi kampus',
        sv: 'Sv kampus',
      },
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
