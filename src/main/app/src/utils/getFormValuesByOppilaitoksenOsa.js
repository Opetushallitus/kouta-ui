import mapValues from 'lodash/mapValues';
import get from 'lodash/get';

import parseEditorState from './draft/parseEditorState';
import { isNumber } from './index';

const getFormValuesByOppilaitoksenOsa = oppilaitoksenOsa => {
  const {
    kieliversiot,
    metadata: { yhteystiedot, esittely, opiskelijoita, kampus, tila },
  } = oppilaitoksenOsa;

  return {
    tila,
    kielivalinta: kieliversiot,
    esittely: mapValues(esittely || {}, kieliversiot, parseEditorState),
    yhteystiedot: {
      osoite: get(yhteystiedot, 'osoite.osoite') || {},
      postinumero: get(yhteystiedot, 'osoite.postinumeroKoodiUri')
        ? { value: yhteystiedot.osoite.postinumeroKoodiUri }
        : null,
      verkkosivu: get(yhteystiedot, 'wwwSivu') || {},
      puhelinnumero: get(yhteystiedot, 'puhelinnumero') || {},
      sahkoposti: get(yhteystiedot, 'sahkoposti') || {},
    },
    perustiedot: {
      opiskelijoita: isNumber(opiskelijoita) ? opiskelijoita : '',
      kampus: kampus || {},
    },
  };
};

export default getFormValuesByOppilaitoksenOsa;
