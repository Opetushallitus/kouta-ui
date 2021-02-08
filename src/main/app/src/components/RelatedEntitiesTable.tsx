import React, { useMemo, useCallback } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import ListSpin from '#/src/components/ListSpin';
import ListTable, {
  makeNimiColumn,
  makeModifiedColumn,
  makeTilaColumn,
} from '#/src/components/ListTable';
import { Typography } from '#/src/components/virkailija';
import useApiAsync from '#/src/hooks/useApiAsync';

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
      _fp.flow(
        _fp.map(entity => ({ ...entity, key: entity.oid })),
        _fp.sortBy(e => e.nimi[i18n.language])
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
      {_fp.isNil(rows) ? (
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
