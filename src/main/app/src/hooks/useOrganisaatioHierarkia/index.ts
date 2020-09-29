import useApiAsync from '#/src/hooks/useApiAsync';
import getOrganisaatioHierarkiaByOid from '#/src/utils/organisaatio/getOrganisaatioHierarkiaByOid';
import filterTree from '#/src/utils/filterTree';

type UseOrganisaatioHierarkiaOptions =
  | {
      skipParents?: boolean;
      filter?: typeof filterTree;
    }
  | undefined;

export const useOrganisaatioHierarkia = (
  oid: string,
  { skipParents = false, filter }: UseOrganisaatioHierarkiaOptions = {}
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
