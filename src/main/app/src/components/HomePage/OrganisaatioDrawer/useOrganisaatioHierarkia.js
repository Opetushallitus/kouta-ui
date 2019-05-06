import { useMemo } from 'react';

import { isString, isArray } from '../../../utils';
import { getOrganisaatioHierarkia } from '../../../apiUtils';
import useApiAsync from '../../useApiAsync';
import { getFilteredHierarkia } from '../utils';

const getMap = arr => {
  let map = {};

  for (let value of arr) {
    if (isString(value)) {
      map[value] = true;
    }
  }

  return map;
};

const getParentOidPath = parentOidPathString =>
  isString(parentOidPathString) ? parentOidPathString.split('/') : [];

const useOrganisaatioHierarkia = ({ includedOids = [], name }) => {
  const oidMap = useMemo(() => getMap(includedOids), [includedOids]);

  const promiseFn = useMemo(() => {
    if (!isString(name) || name.length < 3) {
      return () => Promise.resolve([]);
    }

    return getOrganisaatioHierarkia;
  }, [name]);

  const { data, ...rest } = useApiAsync({
    promiseFn,
    searchString: name,
    watch: name,
  });

  const hierarkia = useMemo(() => {
    return isArray(data)
      ? getFilteredHierarkia(
          data,
          ({ oid, parentOidPath }) =>
            oidMap[oid] || getParentOidPath(parentOidPath).find(o => oidMap[o]),
        )
      : [];
  }, [data, oidMap]);

  return { hierarkia, ...rest };
};

export default useOrganisaatioHierarkia;
