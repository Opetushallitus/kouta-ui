import _ from 'lodash/fp';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

export const flatFilterHierarkia = (hierarkia, filterFn) => {
  return hierarkia.flatMap(org => [
    ...(filterFn(org)
      ? [org]
      : flatFilterHierarkia(org.children || [], filterFn)),
  ]);
};

export const filterByName = (hierarkia, name, language) => {
  return hierarkia.flatMap(org => {
    const orgName = getFirstLanguageValue(org?.nimi, language);

    const isMatch = _.isString(orgName)
      ? orgName.toLowerCase().indexOf(name) >= 0
      : false;

    const matchingChildren = filterByName(org.children || [], name, language);

    if (isMatch || matchingChildren.length > 0) {
      return [org];
    }

    return [];
  });
};

export const flattenHierarkia = _.flatMap(org => [
  org,
  ...flattenHierarkia(org?.children ?? []),
]);
