import useApiAsync from '#/src/hooks/useApiAsync';
import getOrganisaatioHierarkiaByOid from '#/src/utils/organisaatio/getOrganisaatioHierarkiaByOid';
import filterTree from '#/src/utils/filterTree';

export const useOrganisaatioHierarkia = (
  oid,
  { skipParents = false, filter = undefined } = {}
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
