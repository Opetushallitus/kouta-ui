import { isString, isArray } from './index';
import filterTree from './filterTree';

const getOidMap = arr => {
  let map = {};

  for (let value of arr) {
    if (isString(value)) {
      map[value] = true;
    }
  }

  return map;
};

const getParentOidPath = parentOidPathString =>
  isString(parentOidPathString)
    ? parentOidPathString.split('/').filter(v => !!v)
    : [];

const filterOrganisaatioHierarkiaByOids = (hierarkia, oids) => {
  const oidMap = getOidMap(oids);

  return isArray(hierarkia)
    ? filterTree(
        hierarkia,
        ({ oid, parentOidPath }) =>
          oidMap[oid] || getParentOidPath(parentOidPath).find(o => oidMap[o]),
      )
    : [];
};

export default filterOrganisaatioHierarkiaByOids;
