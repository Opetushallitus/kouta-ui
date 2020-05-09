import useApiAsync from '../useApiAsync';
import getOrganisaatioHierarkiaByOid from '../../utils/organisaatioService/getOrganisaatioHierarkiaByOid';
import filterTree from '#/src/utils/filterTree';

export const useOrganisaatioHierarkia = (
  oid,
  { skipParents = false, filter } = {}
) => {
  const { data, ...rest } = useApiAsync({
    promiseFn: getOrganisaatioHierarkiaByOid,
    oid,
    skipParents,
    watch: oid,
  });

  const hierarkia = filterTree(data, filter);

  return { hierarkia, ...rest };
};

export default useOrganisaatioHierarkia;
