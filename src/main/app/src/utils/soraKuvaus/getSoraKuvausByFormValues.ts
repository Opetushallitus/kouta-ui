import _ from 'lodash/fp';

import { serializeEditorState } from '#/src/components/Editor/utils';

const getSoraKuvausByFormValues = values => {
  const { tila, muokkaaja } = values;

  const kielivalinta = values?.kieliversiot ?? [];
  const pickTranslations = _.pick(kielivalinta);

  return {
    tila,
    muokkaaja,
    nimi: pickTranslations(values?.tiedot?.nimi ?? {}),
    koulutustyyppi: values?.koulutustyyppi || null,
    kielivalinta,
    metadata: {
      kuvaus: _.mapValues(
        serializeEditorState,
        pickTranslations(values?.tiedot?.kuvaus ?? {})
      ),
    },
  };
};

export default getSoraKuvausByFormValues;
