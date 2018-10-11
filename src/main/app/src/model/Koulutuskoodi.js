//TODO: Remove class and replace with functional approach

import {LANGUAGE} from '../config/constants';

const findLocalizedMetadataEntries = (koulutuskoodi) => koulutuskoodi.metadata.filter((entry) => entry.kieli === LANGUAGE);

export const extractKoodiUri = (koulutuskoodi) =>  koulutuskoodi.koodiUri;

export const getNimi = (koulutuskoodi) => koulutuskoodi ? findLocalizedMetadataEntries(koulutuskoodi)[0].nimi : null;

export const getId = (koulutuskoodi) => extractKoodiUri(koulutuskoodi) + '-' + extractVersio(koulutuskoodi);

export const getSelectedOptions = (koulutuskoodi) => findLocalizedMetadataEntries(koulutuskoodi).map((entry) => ({
  label: entry.nimi,
  id: getId(koulutuskoodi),
  comparisonValue: entry.nimi.toLowerCase()
}));

export const extractVersio = (koulutuskoodi) => koulutuskoodi.versio;