import { useMemo } from 'react';

import { flow, sortBy, sortedUniqBy } from 'lodash';

import { OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import { notToimipisteOrg } from '#/src/utils';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import { flattenHierarkia } from '#/src/utils/organisaatio/hierarkiaHelpers';

export const useSelectableLiittajaOrganisaatiot = () => {
  const { hierarkia = [], isLoading: isLoadingHierarkia } =
    useOrganisaatioHierarkia(OPETUSHALLITUS_ORGANISAATIO_OID, {
      filter: notToimipisteOrg,
    });

  const liittajaOrganisaatiot = useMemo(
    () =>
      flow(
        h => flattenHierarkia(h),
        h => sortBy(h, e => getFirstLanguageValue(e.nimi)),
        h => sortedUniqBy(h, 'oid')
      )(hierarkia),
    [hierarkia]
  );

  return {
    liittajaOrganisaatiot,
    isLoading: isLoadingHierarkia,
  };
};
