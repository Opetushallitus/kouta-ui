//TODO: Remove class and replace with functional approach

import {LANGUAGE} from '../config/constants';

export const findLocalizedMetadataEntries = (koulutuskoodi) => koulutuskoodi.metadata.filter((entry) => entry.kieli === LANGUAGE);
