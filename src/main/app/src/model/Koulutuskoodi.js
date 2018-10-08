//TODO: Remove class and replace with functional approach

import {LANGUAGE} from '../config/constants';

const findLocalizedMetadataEntries = (koulutuskoodi) => koulutuskoodi.metadata.filter((entry) => entry.kieli === LANGUAGE);

export const getKoodiUri = (koulutuskoodi) =>  koulutuskoodi.koodiUri;

export const getNimi = (koulutuskoodi) => findLocalizedMetadataEntries(koulutuskoodi)[0].nimi;

export const getId = (koulutuskoodi) => getKoodiUri(koulutuskoodi) + '-' + getVersio(koulutuskoodi);

export const getSelectedOptions = (koulutuskoodi) => findLocalizedMetadataEntries(koulutuskoodi).map((entry) => ({
  label: entry.nimi,
  id: getId(koulutuskoodi),
  comparisonValue: entry.nimi.toLowerCase()
}));

export const getVersio = (koulutuskoodi) => koulutuskoodi.versio;