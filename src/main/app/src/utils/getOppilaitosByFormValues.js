import get from 'lodash/get';
import mapValues from 'lodash/mapValues';

import serializeEditorState from './draft/serializeEditorState';
import { isNumeric } from './index';

const getOppilaitosByFormValues = ({ tila, muokkaaja, ...values }) => {
  const { osat, perustiedot, esittely, yhteystiedot, tietoa } = values;

  const {
    osoite,
    postinumero,
    postitoimipaikka,
    puhelinnumero,
    verkkosivu,
  } = yhteystiedot;

  const tietoaOpiskelusta = Object.keys(get(tietoa, 'osiot') || []).map(
    ({ value: otsikkoKoodiUri }) => ({
      otsikkoKoodiUri,
      teksti: get(tietoa, ['tiedot', otsikkoKoodiUri]) || {},
    }),
  );

  return {
    tila,
    muokkaaja,
    metadata: {
      osoite: osoite || {},
      postinumero: postinumero || null,
      postitoimipaikka: postitoimipaikka || {},
      puhelinnumero: puhelinnumero || null,
      verkkosivu: verkkosivu || null,
      esittely: mapValues(esittely || {}, serializeEditorState),
      osat: osat || [],
      tietoaOpiskelusta,
      opiskelijoita: isNumeric(get(perustiedot, 'opiskelijoita'))
        ? parseInt(perustiedot.opiskelijoita)
        : null,
      korkeakouluja: isNumeric(get(perustiedot, 'korkeakouluja'))
        ? parseInt(perustiedot.korkeakouluja)
        : null,
      tiedekuntia: isNumeric(get(perustiedot, 'tiedekuntia'))
        ? parseInt(perustiedot.tiedekuntia)
        : null,
      kampuksia: isNumeric(get(perustiedot, 'kampuksia'))
        ? parseInt(perustiedot.kampuksia)
        : null,
      yksikoita: isNumeric(get(perustiedot, 'yksikoita'))
        ? parseInt(perustiedot.yksikoita)
        : null,
      toimipisteita: isNumeric(get(perustiedot, 'toimipisteita'))
        ? parseInt(perustiedot.toimipisteita)
        : null,
      akatemioita: isNumeric(get(perustiedot, 'akatemioita'))
        ? parseInt(perustiedot.akatemioita)
        : null,
    },
  };
};

export default getOppilaitosByFormValues;
