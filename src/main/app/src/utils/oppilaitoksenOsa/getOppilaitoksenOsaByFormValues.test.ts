import { parseEditorState } from '#/src/components/Editor/utils';
import { getOppilaitoksenOsaByFormValues } from '#/src/utils/oppilaitoksenOsa/getOppilaitoksenOsaByFormValues';

test('getOppilaitoksenOsaByFormValues returns correct oppilaitoksen osa given form values', () => {
  const oppilaitos = getOppilaitoksenOsaByFormValues({
    oppilaitosOid: '888.888.888',
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
      wwwSivuUrl: {
        fi: 'www.verkkosivu.fi',
        sv: 'www.verkkosivu.sv',
      },
      wwwSivuNimi: {
        fi: 'Verkkosivu fi',
        sv: 'Verkkosivu sv',
      },
    },
    yhteystiedot: [
      {
        nimi: {
          fi: 'Yhteystiedon nimi',
          sv: 'Yhteystiedon nimi sv',
        },
        postiosoite: {
          fi: 'Fi osoite',
          sv: 'Sv osoite',
        },
        postinumero: { value: 'postinumero_1#1' },
        kayntiosoite: {
          fi: 'Fi osoite',
          sv: 'Sv osoite',
        },
        kayntiosoitePostinumero: { value: 'postinumero_1#1' },
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
  });

  expect(oppilaitos).toMatchSnapshot();
});
