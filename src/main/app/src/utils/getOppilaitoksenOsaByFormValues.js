import get from 'lodash/get';
import mapValues from 'lodash/mapValues';

import serializeEditorState from './draft/serializeEditorState';
import { isNumeric } from './index';

const getOppilaitoksenOsaByFormValues = ({ tila, muokkaaja, ...values }) => {
  const { perustiedot, esittely, yhteystiedot } = values;

  const { osoite, postinumero, puhelinnumero, verkkosivu } = yhteystiedot;

  return {
    tila,
    muokkaaja,
    metadata: {
      osoite: osoite || {},
      postinumeroKoodiUri: get(postinumero, 'value') || null,
      puhelinnumero: puhelinnumero || null,
      verkkosivu: verkkosivu || null,
      esittely: mapValues(esittely || {}, serializeEditorState),
      opiskelijoita: isNumeric(get(perustiedot, 'opiskelijoita'))
        ? parseInt(perustiedot.opiskelijoita)
        : null,
      kampus: get(perustiedot, 'kampus') || {},
    },
  };
};

export default getOppilaitoksenOsaByFormValues;
