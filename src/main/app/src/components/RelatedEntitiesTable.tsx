import React, { useMemo, useCallback } from 'react';
import { map, sortBy, compose, isNil } from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Typography } from '#/src/components/virkailija';
import useApiAsync from '#/src/hooks/useApiAsync';
import ListTable, {
  makeNimiColumn,
  makeModifiedColumn,
  makeTilaColumn,
} from '#/src/components/ListTable';
import ListSpin from '#/src/components/ListSpin';

export const RelatedEntitiesTable = function ({
  entity,
  organisaatioOid,
  getData,
  getLinkUrl,
  noResultsMessage,
}) {
  const { oid = null } = entity;
  const { t, i18n } = useTranslation();

  const getSafeData = useCallback(getData, [getData]);

  const { data: results } = useApiAsync({
    promiseFn: getSafeData,
    oid,
    organisaatioOid,
    watch: JSON.stringify([oid, organisaatioOid]),
  });

  const rows = useMemo(() => {
    return (
      results &&
      compose(
        sortBy(e => e.nimi[i18n.language]),
        map(entity => ({ ...entity, key: entity.oid }))
      )(results)
    );
  }, [results, i18n.language]);

  const tableColumns = useMemo(
    () => [
      makeNimiColumn(t, {
        getLinkUrl,
      }),
      makeTilaColumn(t),
      makeModifiedColumn(t),
    ],
    [t, getLinkUrl]
  );

  return (
    <>
      {isNil(rows) ? (
        <ListSpin />
      ) : (
        <>
          {rows.length === 0 ? (
            <Typography>{noResultsMessage}</Typography>
          ) : (
            <ListTable rows={rows} columns={tableColumns} />
          )}
        </>
      )}
    </>
  );
};
