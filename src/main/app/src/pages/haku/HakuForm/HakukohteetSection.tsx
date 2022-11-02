import React, { useContext, useMemo } from 'react';

import { useActor } from '@xstate/react';
import { useTranslation } from 'react-i18next';

import {
  makeModifiedColumn,
  makeNimiColumn,
  makeTilaColumn,
  makeOrganisaatioColumn,
} from '#/src/components/ListTable';
import { ENTITY } from '#/src/constants';
import { EntitySearchList } from '#/src/pages/HomePage/EntitySearchList';
import { FilterStateContext } from '#/src/pages/HomePage/FilterStateProvider';
import { useFilterState } from '#/src/pages/HomePage/useFilterState';
import { searchFilteredHakukohteet } from '#/src/utils/hakukohde/searchHakukohteet';

const useTableColumns = (t, organisaatioOid) =>
  useMemo(
    () => [
      makeNimiColumn(t, {
        getLinkUrl: ({ oid }) =>
          `/organisaatio/${organisaatioOid}/hakukohde/${oid}/muokkaus`,
      }),
      makeOrganisaatioColumn(t),
      makeTilaColumn(t),
      makeModifiedColumn(t),
    ],
    [t, organisaatioOid]
  );

const { HAKUKOHDE } = ENTITY;

export const HakukohteetSection = function ({ haku, organisaatioOid }) {
  const { t } = useTranslation();

  const columns = useTableColumns(t, organisaatioOid);

  let filterParams = { hakuOid: haku?.oid };

  const filterServices = useContext(FilterStateContext);
  const [state] = useActor(filterServices.filterService);
  const { send } = filterServices.filterService;

  const filterState = useFilterState(HAKUKOHDE, state, send);

  return (
    <EntitySearchList
      searchEntities={searchFilteredHakukohteet(filterParams)}
      organisaatioOid={organisaatioOid}
      entityType={HAKUKOHDE}
      columns={columns}
      nimiPlaceholder={t('etusivu.haeHakukohteita')}
      filterState={filterState}
    />
  );
};
