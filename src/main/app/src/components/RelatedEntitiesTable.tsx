import React, { useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import ListSpin from '#/src/components/ListSpin';
import ListTable, {
  makeNimiColumn,
  makeModifiedColumn,
  makeOrganisaatioColumn,
  makeTilaColumn,
} from '#/src/components/ListTable';
import { Typography } from '#/src/components/virkailija';

export const RelatedEntitiesTable = function ({
  data,
  getLinkUrl,
  noResultsMessage,
}) {
  const { t, i18n } = useTranslation();

  console.log('DATA: ' + JSON.stringify(data, null, 4));

  const rows = useMemo(() => {
    return (
      data &&
      _fp.flow(
        _fp.map(entity => ({ ...entity, key: entity.oid })),
        _fp.sortBy(e => e.nimi[i18n.language])
      )(data)
    );
  }, [data, i18n.language]);

  const tableColumns = useMemo(
    () => [
      makeNimiColumn(t, {
        getLinkUrl,
      }),
      makeOrganisaatioColumn(t),
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
