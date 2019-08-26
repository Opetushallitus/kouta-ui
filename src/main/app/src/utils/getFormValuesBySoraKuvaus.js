import mapValues from 'lodash/mapValues';

import parseEditorState from './draft/parseEditorState';

const getFormValuesBySoraKuvaus = soraKuvaus => {
  const {
    nimi,
    julkinen,
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
      kuvaus: mapValues(kuvaus || {}, parseEditorState),
    },
    julkinen: Boolean(julkinen),
    koulutustyyppi: koulutustyyppi || null,
  };
};

export default getFormValuesBySoraKuvaus;
