import get from 'lodash/get';

import { isString } from './utils';

const getSeparator = str => {
  if (str.indexOf('|') >= 0) {
    return '|';
  } else if (str.indexOf('/') >= 0) {
    return '/';
  }

  return undefined;
};

const getOrganisaatioParentOidPath = organisaatio => {
  const pathStr = get(organisaatio, 'parentOidPath');

  if (!isString(pathStr)) {
    return [];
  }

  const separator = getSeparator(pathStr);

  if (!separator) {
    return [];
  }

  return pathStr.split(separator).filter(v => !!v);
};

export default getOrganisaatioParentOidPath;
