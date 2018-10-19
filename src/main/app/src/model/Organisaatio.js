import {LANGUAGE} from '../config/constants';

export const extractOrganisaatioOptions = (jsonData) => jsonData.organisaatiot.map((entry) => ({
  label: entry.nimi[LANGUAGE.toLowerCase()],
  value: entry.oid
})).slice(0, 10);
