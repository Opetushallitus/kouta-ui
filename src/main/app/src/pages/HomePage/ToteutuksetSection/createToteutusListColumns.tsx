import React from 'react';

import Badge from '#/src/components/Badge';
import {
  makeKoulutustyyppiColumn,
  makeModifiedColumn,
  makeMuokkaajaColumn,
  makeNimiColumn,
  makeTilaColumn,
} from '#/src/components/ListTable';
import { Box } from '#/src/components/virkailija';

import {
  createHeadingCheckbox,
  createRowCheckbox,
} from '../EntityListCheckboxes';

export const createToteutusListColumns = (
  t,
  organisaatioOid,
  selectionActor
) => {
  const HeadingCheckbox = createHeadingCheckbox(selectionActor);
  return [
    {
      title: ({ rows }) => <HeadingCheckbox rows={rows} />,
      key: 'selected',
      Component: createRowCheckbox(selectionActor),
    },
    makeNimiColumn(t, {
      getLinkUrl: ({ oid }) =>
        `/organisaatio/${organisaatioOid}/toteutus/${oid}/muokkaus`,
    }),
    makeKoulutustyyppiColumn(t),
    makeTilaColumn(t),
    makeModifiedColumn(t),
    makeMuokkaajaColumn(t),
    {
      title: t('etusivu.kiinnitetytHakukohteet'),
      key: 'hakukohteet',
      render: ({ hakukohdeCount = 0 }) => (
        <Box width="100%" textAlign="center">
          <Badge color="primary">{hakukohdeCount}</Badge>
        </Box>
      ),
    },
  ];
};
