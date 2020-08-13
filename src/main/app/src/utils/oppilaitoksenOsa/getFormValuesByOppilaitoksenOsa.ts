import _ from 'lodash';
import { parseEditorState } from '#/src/components/Editor/utils';

const getFormValuesByOppilaitoksenOsa = oppilaitoksenOsa => {
  const {
    kieliversiot,
    teemakuva,
    metadata: { yhteystiedot, esittely, opiskelijoita, kampus, tila },
    oppilaitosOid,
  } = oppilaitoksenOsa;

  return {
    tila,
    oppilaitosOid,
    kielivalinta: kieliversiot,
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
  };
};

export default getFormValuesByOppilaitoksenOsa;
