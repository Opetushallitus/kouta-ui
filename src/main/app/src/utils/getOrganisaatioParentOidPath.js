import get from 'lodash/get';

import { isString } from './index';

const getSeparator = str => {
  if (str.indexOf('|') >= 0) {
    return '|';
  } else if (str.indexOf('/') >= 0) {
    return '/';
  }

  return '/';
};

const getOrganisaatioParentOidPath = organisaatio => {
  const pathStr = get(organisaatio, 'parentOidPath');

  if (!isString(pathStr)) {
    return [];
  }

  const separator = getSeparator(pathStr);

  return pathStr.split(separator).filter(v => !!v);
};

export default getOrganisaatioParentOidPath;
