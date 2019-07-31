import parseEditorState from './draft/parseEditorState';
import { isNumber } from './index';

const getFormValuesByOppilaitoksenOsa = oppilaitoksenOsa => {
  const {
    metadata: {
      osoite,
      postinumero,
      postitoimipaikka,
      esittely,
      verkkosivu,
      puhelinnumero,
      opiskelijoita,
      kampus,
    },
  } = oppilaitoksenOsa;

  return {
    esittely: parseEditorState(esittely),
    yhteystiedot: {
      osoite: osoite || {},
      postinumero: postinumero || '',
      postitoimipaikka: postitoimipaikka || {},
      verkkosivu: verkkosivu || '',
      puhelinnumero: puhelinnumero || '',
    },
    perustiedot: {
      opiskelijoita: isNumber(opiskelijoita) ? opiskelijoita : '',
      kampus: kampus || {},
    },
  };
};

export default getFormValuesByOppilaitoksenOsa;
