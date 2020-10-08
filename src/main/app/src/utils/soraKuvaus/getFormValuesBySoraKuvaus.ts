import _ from 'lodash/fp';

import { parseEditorState } from '#/src/components/Editor/utils';

const getFormValuesBySoraKuvaus = soraKuvaus => {
  const {
    nimi,
    koulutustyyppi,
    kielivalinta,
    metadata = {},
    tila,
  } = soraKuvaus;

  const { kuvaus } = metadata;

  return {
    tila,
    kieliversiot: kielivalinta || [],
    tiedot: {
      nimi: nimi || {},
      kuvaus: _.mapValues(parseEditorState, kuvaus || {}),
    },
    koulutustyyppi: koulutustyyppi || null,
  };
};

export default getFormValuesBySoraKuvaus;
