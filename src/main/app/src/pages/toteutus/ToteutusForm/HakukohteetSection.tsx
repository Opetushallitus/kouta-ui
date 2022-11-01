import React, { useMemo } from 'react';

import { useMachine } from '@xstate/react';
import { useTranslation } from 'react-i18next';

import {
  makeModifiedColumn,
  makeNimiColumn,
  makeHakuColumn,
  makeTilaColumn,
  makeOrganisaatioColumn,
} from '#/src/components/ListTable';
import { ENTITY } from '#/src/constants';
import { filterMachine } from '#/src/hooks/useFilter';
import { EntitySearchList } from '#/src/pages/HomePage/EntitySearchList';
import { useFilterState } from '#/src/pages/HomePage/useFilterState';
import { searchFilteredHakukohteet } from '#/src/utils/hakukohde/searchHakukohteet';

const useTableColumns = (t, organisaatioOid) =>
  useMemo(
    () => [
      makeNimiColumn(t, {
        getLinkUrl: ({ oid }) =>
          `/organisaatio/${organisaatioOid}/hakukohde/${oid}/muokkaus`,
      }),
      makeHakuColumn(t, {
        getLinkUrl: ({ hakuOid }) =>
          `/organisaatio/${organisaatioOid}/haku/${hakuOid}/muokkaus/`,
      }),
      makeOrganisaatioColumn(t),
      makeTilaColumn(t),
      makeModifiedColumn(t),
    ],
    [t, organisaatioOid]
  );

const { HAKUKOHDE } = ENTITY;

export const HakukohteetSection = function ({ toteutus, organisaatioOid }) {
  const { t } = useTranslation();

  const columns = useTableColumns(t, organisaatioOid);

  const [state, send] = useMachine(filterMachine);

  let filterParams = { toteutusOid: toteutus?.oid };

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
