import { useMemo } from 'react';

import _ from 'lodash';

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
      _.flow(
        h => flattenHierarkia(h),
        h => (isAvoinKorkeakoulutus ? [...h, ...organisaatiot] : h),
        h => _.sortBy(h, e => getFirstLanguageValue(e.nimi)),
        h => _.sortedUniqBy(h, 'oid')
      )(hierarkia),
    [hierarkia, organisaatiot, isAvoinKorkeakoulutus]
  );

  return {
    tarjoajat,
    isLoading: isLoadingHierarkia || isLoadingOppilaitokset,
  };
};
