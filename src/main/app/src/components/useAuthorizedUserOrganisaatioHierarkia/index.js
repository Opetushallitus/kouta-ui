import { useMemo } from 'react';

import useAuthorizedUserOrganisaatioOids from '../useAuthorizedUserOrganisaatioOids';
import useOrganisaatioHierarkia from '../useOrganisaatioHierarkia';
import filterOrganisaatioHierarkiaByOids from '../../utils/filterOrganisaatioHierarkiaByOids';
import { isArray } from '../../utils';

const useAuthorizedUserOrganisaatioHierarkia = oid => {
  const {
    organisaatioOids,
    isLoading: oidsIsLoading,
  } = useAuthorizedUserOrganisaatioOids();

  const { hierarkia, isLoading: hierarkiaIsLoading } = useOrganisaatioHierarkia(
    oid,
  );

  const filteredHierarkia = useMemo(() => {
    return isArray(organisaatioOids) && isArray(hierarkia)
      ? filterOrganisaatioHierarkiaByOids(hierarkia, organisaatioOids)
      : undefined;
  }, [hierarkia, organisaatioOids]);

  return {
    hierarkia: filteredHierarkia,
    isLoading: oidsIsLoading || hierarkiaIsLoading,
  };
};

export default useAuthorizedUserOrganisaatioHierarkia;
