import _ from 'lodash';

export const searchOrgsFromHierarkiaWithName = (
  hierarkia,
  name,
  language = 'fi'
) => {
  return hierarkia.reduce((result, org) => {
    const filteredOrg = {
      ...org,
      children: searchOrgsFromHierarkiaWithName(org.children, name, language),
    };

    const regex = new RegExp(`${name}.+`, 'gmi');
    const orgNimi = filteredOrg.nimi[language]
      ? filteredOrg.nimi[language].match(regex)
      : filteredOrg.nimi.fi.match(regex);
    if (!_.isEmpty(orgNimi) || filteredOrg.children.length > 0) {
      return [...result, org];
    } else {
      return result;
    }
  }, []);
};
