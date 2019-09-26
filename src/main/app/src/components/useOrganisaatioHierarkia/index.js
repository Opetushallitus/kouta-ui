import useApiAsync from '../useApiAsync';
import getOrganisaatioHierarkiaByOid from '../../utils/organisaatioService/getOrganisaatioHierarkiaByOid';

export const useOrganisaatioHierarkia = (oid, { skipParents = false } = {}) => {
  const { data, ...rest } = useApiAsync({
    promiseFn: getOrganisaatioHierarkiaByOid,
    oid,
    skipParents,
    watch: oid,
  });

  return { hierarkia: data, ...rest };
};

export default useOrganisaatioHierarkia;
