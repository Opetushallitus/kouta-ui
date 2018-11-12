import {getLanguage} from '../stores/generic/LanguageStore';

export const extractOrganisaatioOptions = (jsonData) =>
  jsonData.filter(entry => entry.tyypit.includes('organisaatiotyyppi_02')).map((entry) => ({
    label: entry.nimi[getLanguage()],
    value: entry.oid
}));
