import useApiAsync from '../useApiAsync';
import { getOrganisaatioHierarchyByOid } from '../../apiUtils';

export const useOrganisaatioHierarkia = oid => {
  const { data, ...rest } = useApiAsync({
    promiseFn: getOrganisaatioHierarchyByOid,
    oid,
    watch: oid,
  });

  return { hierarkia: data, ...rest };
};

export default useOrganisaatioHierarkia;
