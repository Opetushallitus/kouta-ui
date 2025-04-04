import { parseEditorState } from '#/src/components/LexicalEditorUI/utils';
import { getOppilaitosByFormValues } from '#/src/utils/oppilaitos/getOppilaitosByFormValues';

const oppilaitosFormVals = {
  tila: 'tallennettu',
  muokkaaja: '1.1.1.1',
  kieliversiot: ['fi', 'sv'],
  tietoa: {
    osiot: [{ value: 'osio_1#1' }],
    tiedot: {
      'osio_1#1': {
        fi: parseEditorState('Fi tiedot'),
        sv: parseEditorState('Sv tiedot'),
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
    wwwSivuUrl: {
      fi: 'www.verkkosivu.fi',
      sv: 'www.verkkosivu.sv',
    },
    wwwSivuNimi: {
      fi: 'Verkkosivu fi',
      sv: 'Verkkosivu sv',
    },
    jarjestaaUrheilijanAmmKoulutusta: false,
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
  hakijapalveluidenYhteystiedot: {
    nimi: {
      fi: 'Hakijapalveluiden nimi',
      sv: 'Hakijapalveluiden nimi sv',
    },
    postiosoite: {
      fi: 'Fi osoite',
      sv: 'Sv osoite',
    },
    postinumero: { fi: { value: 'postinumero_1#1' } },
    kayntiosoite: {
      fi: 'Fi osoite',
      sv: 'Sv osoite',
    },
    kayntiosoitePostinumero: { fi: { value: 'postinumero_1#1' } },
    puhelinnumero: {
      fi: '1234',
      sv: '5678',
    },
    sahkoposti: {
      fi: 'fi@sahkoposti.fi',
      sv: 'sv@sahkoposti.sv',
    },
  },
  teemakuvaOrEsittelyvideo: {
    mediaType: 'esittelyvideo',
    teemakuvaUrl: undefined,
    esittelyvideoUrl: {
      fi: 'https://foo.bar',
    },
  },
};

test('getOppilaitosByFormValues returns correct oppilaitos given form values', () => {
  const oppilaitos = getOppilaitosByFormValues(oppilaitosFormVals);

  expect(oppilaitos).toMatchSnapshot();
});

test('getOppilaitosByFormValues returns only some keys with values on them', () => {
  const some = {
    sosiaalinenmedia_1: '',
    sosiaalinenmedia_2: 'https://youtube.com/RuhtinasNukettaja',
  };
  const oppilaitos = getOppilaitosByFormValues(
    Object.assign(oppilaitosFormVals, { perustiedot: { some } })
  );
  expect(oppilaitos.metadata.some).toEqual({
    sosiaalinenmedia_2: 'https://youtube.com/RuhtinasNukettaja',
  });
  expect(oppilaitos).toMatchSnapshot();
});
