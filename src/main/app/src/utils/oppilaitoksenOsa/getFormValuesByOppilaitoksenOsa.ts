import _ from 'lodash';

import { parseEditorState } from '#/src/components/Editor/utils';

const getFormValuesByOppilaitoksenOsa = oppilaitoksenOsa => {
  const {
    kielivalinta,
    teemakuva,
    tila,
    metadata: { yhteystiedot, esittely, opiskelijoita, kampus },
    oppilaitosOid,
    esikatselu = false,
  } = oppilaitoksenOsa;

  return {
    tila,
    oppilaitosOid,
    kieliversiot: kielivalinta,
    esittely: _.mapValues(esittely || {}, parseEditorState),
    yhteystiedot: {
      osoite: yhteystiedot?.osoite?.osoite || {},
      postinumero: yhteystiedot?.osoite?.postinumeroKoodiUri
        ? { value: yhteystiedot.osoite.postinumeroKoodiUri }
        : null,
      verkkosivu: yhteystiedot?.wwwSivu || {},
      puhelinnumero: yhteystiedot?.puhelinnumero || {},
      sahkoposti: yhteystiedot?.sahkoposti || {},
    },
    perustiedot: {
      opiskelijoita: _.isNumber(opiskelijoita) ? opiskelijoita : '',
      kampus: kampus || {},
    },
    teemakuva,
    esikatselu,
  };
};

export default getFormValuesByOppilaitoksenOsa;
