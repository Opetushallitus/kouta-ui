import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { useToteutuksenHakukohteet } from '#/src/utils/toteutus/useToteutuksenHakukohteet';

import {
  makeModifiedColumn,
  makeNimiColumn,
  makeTilaColumn,
  makeOrganisaatioColumn,
} from '#/src/components/ListTable';

import { searchFilteredHakukohteet } from '#/src/utils/hakukohde/searchHakukohteet';
import { ENTITY } from '#/src/constants';
import { EntitySearchList } from '#/src/pages/HomePage/EntitySearchList';

export const HakukohteetSection = function ({ toteutus, organisaatioOid }) {
  const { t } = useTranslation();
  const { data: enrichedToteutus } = useToteutuksenHakukohteet(
    {
      organisaatioOid,
      toteutusOid: toteutus?.oid,
    },
    { refetchOnWindowFocus: false }
  );

  const useTableColumns = (t, organisaatioOid, userLanguage) =>
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
      [t, organisaatioOid, userLanguage]
    );

  // NOTE: For some reason hakutiedon hakukohde does not have oid
  const usedData = useMemo(
    () =>
      enrichedToteutus?.hakukohteet?.map(hk => ({
        ...hk,
        oid: hk.hakukohdeOid,
      })),
    [enrichedToteutus]
  );

  const { HAKUKOHDE } = ENTITY;

  const columns = useTableColumns(t, organisaatioOid, 'fi');

  let filterParams = { toteutusOid: toteutus?.oid };

  return (
    <EntitySearchList
      searchEntities={searchFilteredHakukohteet(filterParams)}
      organisaatioOid={organisaatioOid}
      entityType={HAKUKOHDE}
      columns={columns}
      nimiPlaceholder={t('etusivu.haeHakukohteita')}
    />
  );
};
