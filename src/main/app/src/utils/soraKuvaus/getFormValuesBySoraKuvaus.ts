import { map, mapValues } from 'lodash-es';

import { parseEditorState } from '#/src/components/LexicalEditorUI/utils';
import { toSelectValue } from '#/src/utils';

const getFormValuesBySoraKuvaus = soraKuvaus => {
  const {
    nimi,
    koulutustyyppi,
    kielivalinta,
    metadata = {},
    tila,
    externalId,
    organisaatioOid,
  } = soraKuvaus;

  const { kuvaus, koulutusKoodiUrit, koulutusalaKoodiUri } = metadata;
  return {
    organisaatioOid: toSelectValue(organisaatioOid),
    externalId,
    tila,
    kieliversiot: kielivalinta || [],
    koulutusala: toSelectValue(koulutusalaKoodiUri),
    koulutukset: map(koulutusKoodiUrit, value => ({ value })),
    tiedot: {
      nimi: nimi || {},
      kuvaus: mapValues(kuvaus || {}, parseEditorState),
    },
    koulutustyyppi: koulutustyyppi || null,
  };
};

export default getFormValuesBySoraKuvaus;
