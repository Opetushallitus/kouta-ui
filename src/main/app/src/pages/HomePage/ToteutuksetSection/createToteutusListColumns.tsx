import React from 'react';

import {
  makeCountColumn,
  makeKoulutustyyppiColumn,
  makeModifiedColumn,
  makeMuokkaajaColumn,
  makeNimiColumn,
  makeTilaColumn,
} from '#/src/components/ListTable';

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
  const RowCheckbox = createRowCheckbox(selectionActor);
  return [
    {
      title: ({ rows }) => <HeadingCheckbox rows={rows} />,
      key: 'selected',
      Component: RowCheckbox,
      style: {
        padding: '8px 0px 8px 8px',
        width: '18px',
      },
    },
    makeNimiColumn(t, {
      getLinkUrl: ({ oid }) =>
        `/organisaatio/${organisaatioOid}/toteutus/${oid}/muokkaus`,
    }),
    makeKoulutustyyppiColumn(t),
    makeTilaColumn(t),
    makeModifiedColumn(t),
    makeMuokkaajaColumn(t),
    makeCountColumn({
      title: t('etusivu.kiinnitetytHakukohteet'),
      key: 'hakukohteet',
      propName: 'hakukohdeCount',
    }),
  ];
};
