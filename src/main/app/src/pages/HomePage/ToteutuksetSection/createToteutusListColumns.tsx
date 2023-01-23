import React from 'react';

import { TFunction } from 'i18next';
import _fp from 'lodash/fp';

import {
  makeCountColumn,
  makeKoulutustyyppiColumn,
  makeModifiedColumn,
  makeMuokkaajaColumn,
  makeNimiColumn,
  makeTilaColumn,
} from '#/src/components/ListTable';
import { ENTITY } from '#/src/constants';

import {
  createHeadingCheckbox,
  createRowCheckbox,
} from '../EntityListCheckboxes';

export const createToteutusListColumns =
  (
    t: TFunction,
    organisaatioOid: string,
    filter: (item: { key: string }) => boolean = _fp.T
  ) =>
  selectionActor => {
    const HeadingCheckbox = createHeadingCheckbox(
      selectionActor,
      ENTITY.TOTEUTUS
    );
    const RowCheckbox = createRowCheckbox(selectionActor, ENTITY.TOTEUTUS);
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
    ].filter(filter);
  };
