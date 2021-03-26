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
    yhteystiedot: yhteystiedot.map(yhteystieto => ({
      nimi: yhteystieto.nimi || {},
      osoite: yhteystieto.osoite?.osoite || {},
      postinumero: yhteystieto.osoite?.postinumeroKoodiUri
        ? { value: yhteystieto.osoite.postinumeroKoodiUri }
        : null,
      verkkosivu: yhteystieto.wwwSivu || {},
      puhelinnumero: yhteystieto.puhelinnumero || {},
      sahkoposti: yhteystieto.sahkoposti || {},
    })),
    perustiedot: {
      opiskelijoita: _.isNumber(opiskelijoita) ? opiskelijoita : '',
      kampus: kampus || {},
    },
    teemakuva,
    esikatselu,
  };
};

export default getFormValuesByOppilaitoksenOsa;
