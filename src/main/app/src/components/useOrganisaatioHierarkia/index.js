import useApiAsync from '../useApiAsync';
import { getOrganisaatioHierarchyByOid } from '../../apiUtils';

export const useOrganisaatioHierarkia = (oid, { skipParents = false } = {}) => {
  const { data, ...rest } = useApiAsync({
    promiseFn: getOrganisaatioHierarchyByOid,
    oid,
    skipParents,
    watch: oid,
  });

  return { hierarkia: data, ...rest };
};

export default useOrganisaatioHierarkia;
