import _fp from 'lodash/fp';

import {
  pickTranslations,
  pickAndSerializeTranslations,
} from '../pickTranslations';

const getSoraKuvausByFormValues = values => {
  const { tila, muokkaaja, koulutusala, koulutukset } = values;

  const kielivalinta = values?.kieliversiot ?? [];

  return {
    organisaatioOid: values?.organisaatioOid?.value,
    externalId: _fp.isEmpty(values?.externalId) ? null : values?.externalId,
    tila,
    muokkaaja,
    nimi: pickTranslations(values?.tiedot?.nimi, kielivalinta),
    koulutustyyppi: values?.koulutustyyppi || null,
    kielivalinta,
    metadata: {
      koulutusalaKoodiUri: koulutusala?.value,
      koulutusKoodiUrit: koulutukset?.map(_fp.prop('value')),
      kuvaus: pickAndSerializeTranslations(
        values?.tiedot?.kuvaus,
        kielivalinta
      ),
    },
  };
};

export default getSoraKuvausByFormValues;
