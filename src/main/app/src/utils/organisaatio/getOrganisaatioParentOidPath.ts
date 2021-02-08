import _ from 'lodash';

const getSeparator = str => {
  if (str.indexOf('|') >= 0) {
    return '|';
  }

  return '/';
};

const getOrganisaatioParentOidPath = organisaatio => {
  if (!_.isObject(organisaatio)) {
    return [];
  }

  const pathStr = _.get(organisaatio, 'parentOidPath');

  if (!_.isString(pathStr)) {
    return _.get(organisaatio, 'oid') ? [organisaatio.oid] : [];
  }

  const separator = getSeparator(pathStr);
  const path = pathStr.split(separator).filter(v => !!v);

  return [...path, organisaatio.oid].filter(v => !!v);
};

export default getOrganisaatioParentOidPath;
