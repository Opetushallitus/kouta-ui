import _ from 'lodash';

import { parseEditorState } from '#/src/components/Editor/utils';
import { OptionalBinaryValue } from '#/src/constants';

export const optionalBoolToRadioValue = value => {
  switch (value) {
    case true:
      return OptionalBinaryValue.KYLLA;
    case false:
      return OptionalBinaryValue.EI;
    default:
      return OptionalBinaryValue.TYHJA;
  }
};

export const getFormValuesByOppilaitoksenOsa = oppilaitoksenOsa => {
  const {
    kielivalinta,
    teemakuva,
    tila,
    metadata = {},
    oppilaitosOid,
    esikatselu = false,
  } = oppilaitoksenOsa;

  const {
    yhteystiedot,
    esittely,
    opiskelijoita,
    kampus,
    wwwSivu,
    jarjestaaUrheilijanAmmKoulutusta,
  } = metadata;

  return {
    tila,
    oppilaitosOid,
    kieliversiot: kielivalinta,
    esittely: _.mapValues(esittely || {}, parseEditorState),
    yhteystiedot: yhteystiedot.map(yhteystieto => ({
      nimi: yhteystieto.nimi || {},
      postiosoite: yhteystieto.postiosoite?.osoite || {},
      postinumero: yhteystieto.postiosoite?.postinumeroKoodiUri
        ? { value: yhteystieto.postiosoite.postinumeroKoodiUri }
        : null,
      kayntiosoite: yhteystieto.kayntiosoite?.osoite || {},
      kayntiosoitePostinumero: yhteystieto.kayntiosoite?.postinumeroKoodiUri
        ? { value: yhteystieto.kayntiosoite.postinumeroKoodiUri }
        : null,
      puhelinnumero: yhteystieto.puhelinnumero || {},
      sahkoposti: yhteystieto.sahkoposti || {},
    })),
    perustiedot: {
      opiskelijoita: _.isNumber(opiskelijoita) ? opiskelijoita : '',
      kampus: kampus || {},
      wwwSivuUrl: wwwSivu?.url || {},
      wwwSivuNimi: wwwSivu?.nimi || {},
      jarjestaaUrheilijanAmmKoulutusta: optionalBoolToRadioValue(
        jarjestaaUrheilijanAmmKoulutusta
      ),
    },
    teemakuva,
    esikatselu,
  };
};
