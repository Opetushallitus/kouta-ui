import _fp from 'lodash/fp';

import { serializeEditorState } from '#/src/components/Editor/utils';

const getSoraKuvausByFormValues = values => {
  const { tila, muokkaaja, koulutusala, koulutukset } = values;

  const kielivalinta = values?.kieliversiot ?? [];
  const pickTranslations = _fp.pick(kielivalinta);

  return {
    externalId: _fp.isEmpty(values?.externalId) ? null : values?.externalId,
    tila,
    muokkaaja,
    nimi: pickTranslations(values?.tiedot?.nimi ?? {}),
    koulutustyyppi: values?.koulutustyyppi || null,
    kielivalinta,
    metadata: {
      koulutusalaKoodiUri: koulutusala?.value,
      koulutusKoodiUrit: koulutukset?.map(_fp.prop('value')),
      kuvaus: _fp.mapValues(
        serializeEditorState,
        pickTranslations(values?.tiedot?.kuvaus ?? {})
      ),
    },
  };
};

export default getSoraKuvausByFormValues;
