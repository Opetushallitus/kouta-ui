import { isEmpty } from 'lodash';

import { OrganisaatioModel } from '#/src/types/domainTypes';

export const searchOrgsFromHierarkiaWithName = (
  hierarkia: Array<OrganisaatioModel>,
  name: string,
  language = 'fi'
): Array<OrganisaatioModel> => {
  return hierarkia.reduce(
    (result: Array<OrganisaatioModel>, org: OrganisaatioModel) => {
      const filteredOrg = {
        ...org,
        children: searchOrgsFromHierarkiaWithName(
          org.children || [],
          name,
          language
        ),
      };

      const regex = new RegExp(`${name}`, 'gmi');
      const orgNimi = filteredOrg.nimi[language]
        ? filteredOrg.nimi[language].match(regex)
        : filteredOrg.nimi.fi?.match(regex);
      if (!isEmpty(orgNimi) || filteredOrg.children.length > 0) {
        return [...result, org];
      } else {
        return result;
      }
    },
    []
  );
};
