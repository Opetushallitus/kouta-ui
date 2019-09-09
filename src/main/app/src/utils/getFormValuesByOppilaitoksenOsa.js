import mapValues from 'lodash/mapValues';

import parseEditorState from './draft/parseEditorState';
import { isNumber } from './index';

const getFormValuesByOppilaitoksenOsa = oppilaitoksenOsa => {
  const {
    metadata: {
      osoite,
      postinumeroKoodiUri,
      esittely,
      verkkosivu,
      puhelinnumero,
      opiskelijoita,
      kampus,
      tila,
    },
  } = oppilaitoksenOsa;

  return {
    tila,
    esittely: mapValues(esittely || {}, parseEditorState),
    yhteystiedot: {
      osoite: osoite || {},
      postinumero: postinumeroKoodiUri ? { value: postinumeroKoodiUri } : null,
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
