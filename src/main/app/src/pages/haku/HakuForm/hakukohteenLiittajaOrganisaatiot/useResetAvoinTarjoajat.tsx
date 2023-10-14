import { useMemo, useEffect, useRef } from 'react';

import _ from 'lodash';

import { ORGANISAATIOTYYPPI } from '#/src/constants';
import { useIsDirty } from '#/src/hooks/form';
import { useHasChanged } from '#/src/hooks/useHasChanged';
import { useOppilaitoksetForAvoinKorkeakoulutus } from '#/src/hooks/useOppilaitoksetForAvoinKorkeakoulutus';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import { flatFilterHierarkia } from '#/src/utils/organisaatio/hierarkiaHelpers';
import { organisaatioMatchesTyyppi } from '#/src/utils/organisaatio/organisaatioMatchesTyyppi';

export const useResetAvoinTarjoajat = ({
  value,
  organisaatioOid,
  isAvoinKorkeakoulutus,
  onChange,
}) => {
  const isAvoinKorkeakoulutusChanged = useHasChanged(isAvoinKorkeakoulutus);
  const isDirty = useIsDirty();

  const { hierarkia: h } = useOrganisaatioHierarkia(organisaatioOid, {
    enabled: !isAvoinKorkeakoulutus,
  });

  const omatOppilaitokset = flatFilterHierarkia(
    h,
    organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.OPPILAITOS)
  );

  const { organisaatiot = [] } = useOppilaitoksetForAvoinKorkeakoulutus({
    enabled: !isAvoinKorkeakoulutus,
  });

  const avoinKkOppilaitosOids = useMemo(
    () =>
      isAvoinKorkeakoulutus
        ? []
        : organisaatiot
            .filter(
              org =>
                !omatOppilaitokset.some(
                  oppilaitos => oppilaitos.oid === org.oid
                )
            )
            .map(org => org.oid),
    [organisaatiot, omatOppilaitokset, isAvoinKorkeakoulutus]
  );

  const hiddenOppilaitosOids = useRef<Array<string>>([]);

  useEffect(() => {
    if (isDirty && isAvoinKorkeakoulutusChanged) {
      if (isAvoinKorkeakoulutus) {
        onChange(_.uniq([...value, ...hiddenOppilaitosOids.current]));
        hiddenOppilaitosOids.current = [];
      } else {
        const oidsToHide: Array<string> = [];

        avoinKkOppilaitosOids.forEach(oid => {
          if (value.includes(oid)) {
            oidsToHide.push(oid);
          }
        });

        // Jos isAvoinKorkeakoulutus vaihtuu falseksi, karsitaan pois tarjoajia
        onChange(_.difference(value, oidsToHide));
        hiddenOppilaitosOids.current = oidsToHide;
      }
    }
  }, [
    isAvoinKorkeakoulutus,
    isAvoinKorkeakoulutusChanged,
    isDirty,
    onChange,
    value,
    avoinKkOppilaitosOids,
  ]);
};
