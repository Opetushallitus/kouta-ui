import useApiAsync from '../useApiAsync';
import getOrganisaatioHierarkiaByOid from '../../utils/organisaatioService/getOrganisaatioHierarkiaByOid';
import iterateTree from '../../utils/iterateTree';

const notToimipiste = org =>
  !org.organisaatiotyypit.includes('organisaatiotyyppi_03');

export const useOrganisaatioHierarkia = (
  oid,
  { skipParents = false, excludeToimipiste = false } = {},
) => {
  const { data, ...rest } = useApiAsync({
    promiseFn: getOrganisaatioHierarkiaByOid,
    oid,
    skipParents,
    watch: oid,
  });

  if (excludeToimipiste) {
    iterateTree(data, self => {
      self.children = self.children.filter(notToimipiste);
    });
  }
  return { hierarkia: data, ...rest };
};

export default useOrganisaatioHierarkia;
