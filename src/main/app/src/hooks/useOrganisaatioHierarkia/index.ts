import useApiAsync from '#/src/hooks/useApiAsync';
import filterTree from '#/src/utils/filterTree';
import getOrganisaatioHierarkiaByOid from '#/src/utils/organisaatio/getOrganisaatioHierarkiaByOid';

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
