import {LANGUAGE} from '../config/constants';

export const extractOrganisaatioOptions = (jsonData) =>
  jsonData.filter(entry => entry.tyypit.includes('organisaatiotyyppi_02')).map((entry) => ({
    label: entry.nimi[LANGUAGE.toLowerCase()],
    value: entry.oid
}));
