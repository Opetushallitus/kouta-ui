import { get, isString, isObject } from 'lodash';

const getSeparator = str => {
  if (str.indexOf('|') >= 0) {
    return '|';
  }

  return '/';
};

const getOrganisaatioParentOidPath = organisaatio => {
  if (!isObject(organisaatio)) {
    return [];
  }

  const pathStr = get(organisaatio, 'parentOidPath');

  if (!isString(pathStr)) {
    return get(organisaatio, 'oid') ? [organisaatio.oid] : [];
  }

  const separator = getSeparator(pathStr);
  const path = pathStr.split(separator).filter(v => !!v);

  return [...path, organisaatio.oid].filter(v => !!v);
};

export default getOrganisaatioParentOidPath;
