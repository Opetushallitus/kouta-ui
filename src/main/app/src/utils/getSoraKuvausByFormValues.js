import get from 'lodash/get';
import pick from 'lodash/pick';
import mapValues from 'lodash/mapValues';

import serializeEditorState from './draft/serializeEditorState';

const getKielivalinta = values => get(values, 'kieliversiot') || [];

const getSoraKuvausByFormValues = values => {
  const { tila, muokkaaja } = values;
  const kielivalinta = getKielivalinta(values);
  const nimi = pick(get(values, 'tiedot.nimi') || {}, kielivalinta);
  const kuvaus = pick(get(values, 'tiedot.kuvaus') || {}, kielivalinta);
  const koulutustyyppi = get(values, 'koulutustyyppi') || null;
  const julkinen = Boolean(get(values, 'julkisuus'));

  return {
    tila,
    muokkaaja,
    nimi,
    julkinen,
    koulutustyyppi,
    kielivalinta,
    metadata: {
      kuvaus: mapValues(kuvaus, serializeEditorState),
    },
  };
};

export default getSoraKuvausByFormValues;
