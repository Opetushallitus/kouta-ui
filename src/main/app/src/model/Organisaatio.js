import {LANGUAGE} from '../config/constants';

const jsonDataExample = {
  "organisaatiot": [
    {
      "oid": "1.2.246.562.10.16873649764",
      "nimi": {
        "fi": "Kuulammen koulu"
      }
    }]
};

export const extractOrganisaatioOptions = (jsonData) => jsonData.organisaatiot.map((entry) => ({
  label: entry.nimi[LANGUAGE.toLowerCase()],
  value: entry.oid
})).slice(0, 10);
