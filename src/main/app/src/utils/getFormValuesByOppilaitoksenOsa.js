import mapValues from 'lodash/mapValues';

import parseEditorState from './draft/parseEditorState';
import { isNumber } from './index';

const getFormValuesByOppilaitoksenOsa = oppilaitoksenOsa => {
  const {
    kieliversiot,
    metadata: {
      osoite: { osoite, postinumeroKoodiUri },
      esittely,
      wwwSivu,
      puhelinnumero,
      opiskelijoita,
      kampus,
      tila,
    },
  } = oppilaitoksenOsa;

  return {
    tila,
    kielivalinta: kieliversiot,
    esittely: mapValues(esittely || {}, kieliversiot, parseEditorState),
    yhteystiedot: {
      osoite: osoite || {},
      postinumero: postinumeroKoodiUri ? { value: postinumeroKoodiUri } : null,
      verkkosivu: wwwSivu || {},
      puhelinnumero: puhelinnumero || '',
    },
    perustiedot: {
      opiskelijoita: isNumber(opiskelijoita) ? opiskelijoita : '',
      kampus: kampus || {},
    },
  };
};

export default getFormValuesByOppilaitoksenOsa;
