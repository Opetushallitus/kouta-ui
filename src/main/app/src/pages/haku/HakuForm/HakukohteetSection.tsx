import React, {useMemo} from 'react';

import { useTranslation } from 'react-i18next';

import {
    makeModifiedColumn,
    makeNimiColumn,
    makeTilaColumn,
    makeOrganisaatioColumn,
} from '#/src/components/ListTable';

import { useHaunHakukohteet } from '#/src/utils/haku/useHaunHakukohteet';
import {ENTITY} from "#/src/constants";
import {searchHaut} from "#/src/utils/haku/searchHaut";
import {EntitySearchList} from "#/src/pages/HomePage/EntitySearchList";
import {searchFilteredHakukohteet, searchHakukohteet} from "#/src/utils/hakukohde/searchHakukohteet";

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

export const HakukohteetSection = function ({ haku, organisaatioOid }) {
  const { t } = useTranslation();
  const { data: enrichedHaku } = useHaunHakukohteet(
    {
      organisaatioOid,
      hakuOid: haku?.oid,
    },
    { refetchOnWindowFocus: false }
  );

  const { HAKUKOHDE } = ENTITY;

  const columns = useTableColumns(t, organisaatioOid, "fi");

  let filterParams = {hakuOid: haku?.oid}

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
