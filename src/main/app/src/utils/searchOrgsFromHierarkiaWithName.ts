import { isEmpty } from 'lodash';

import { Organisaatio } from '#/src/types/domainTypes';

export const searchOrgsFromHierarkiaWithName = (
  hierarkia: Array<Organisaatio>,
  name: string,
  language = 'fi'
): Array<Organisaatio> => {
  return hierarkia.reduce((result: Array<Organisaatio>, org: Organisaatio) => {
    const filteredOrg = {
      ...org,
      children: searchOrgsFromHierarkiaWithName(
        org.children || [],
        name,
        language
      ),
    };

    const regex = new RegExp(`${name}.+`, 'gmi');
    const orgNimi = filteredOrg.nimi[language]
      ? filteredOrg.nimi[language].match(regex)
      : filteredOrg.nimi.fi?.match(regex);
    if (!isEmpty(orgNimi) || filteredOrg.children.length > 0) {
      return [...result, org];
    } else {
      return result;
    }
  }, []);
};
