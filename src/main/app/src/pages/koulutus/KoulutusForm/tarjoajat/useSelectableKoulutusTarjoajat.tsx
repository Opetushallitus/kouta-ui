import { useMemo } from 'react';

import { flow, sortBy, sortedUniqBy } from 'lodash';

import { useFieldValue } from '#/src/hooks/form';
import { useOppilaitoksetForAvoinKorkeakoulutus } from '#/src/hooks/useOppilaitoksetForAvoinKorkeakoulutus';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import { notToimipisteOrg } from '#/src/utils';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import { flattenHierarkia } from '#/src/utils/organisaatio/hierarkiaHelpers';

export const useSelectableKoulutusTarjoajat = ({ organisaatioOid }) => {
  const isAvoinKorkeakoulutus = useFieldValue(
    'information.isAvoinKorkeakoulutus'
  );

  const { organisaatiot = [], isLoading: isLoadingOppilaitokset } =
    useOppilaitoksetForAvoinKorkeakoulutus({ enabled: isAvoinKorkeakoulutus });

  const { hierarkia = [], isLoading: isLoadingHierarkia } =
    useOrganisaatioHierarkia(organisaatioOid, {
      filter: notToimipisteOrg,
    });

  const tarjoajat = useMemo(
    () =>
      flow(
        h => flattenHierarkia(h),
        h => (isAvoinKorkeakoulutus ? [...h, ...organisaatiot] : h),
        h => sortBy(h, e => getFirstLanguageValue(e.nimi)),
        h => sortedUniqBy(h, 'oid')
      )(hierarkia),
    [hierarkia, organisaatiot, isAvoinKorkeakoulutus]
  );

  return {
    tarjoajat,
    isLoading: isLoadingHierarkia || isLoadingOppilaitokset,
  };
};
