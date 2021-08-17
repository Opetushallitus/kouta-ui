import _fp from 'lodash/fp';

import { parseEditorState } from '#/src/components/Editor/utils';
import { toSelectValue } from '#/src/utils';

const getFormValuesBySoraKuvaus = soraKuvaus => {
  const {
    nimi,
    koulutustyyppi,
    kielivalinta,
    metadata = {},
    tila,
    externalId,
  } = soraKuvaus;

  const { kuvaus, koulutusKoodiUrit, koulutusalaKoodiUri } = metadata;
  return {
    externalId,
    tila,
    kieliversiot: kielivalinta || [],
    koulutusala: toSelectValue(koulutusalaKoodiUri),
    koulutukset: _fp.map(value => ({ value }))(koulutusKoodiUrit),
    tiedot: {
      nimi: nimi || {},
      kuvaus: _fp.mapValues(parseEditorState, kuvaus || {}),
    },
    koulutustyyppi: koulutustyyppi || null,
  };
};

export default getFormValuesBySoraKuvaus;
