import React, { useMemo } from 'react';

import _ from 'lodash';
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

  const rows = useMemo(() => {
    return (
      data &&
      _.flow(
        $ => $.map(entity => ({ ...entity, key: entity.oid })),
        $ => _.sortBy($, e => e.nimi[i18n.language])
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
      {_.isNil(rows) ? (
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
