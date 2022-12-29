import React from 'react';

import { TFunction } from 'i18next';

import {
  makeModifiedColumn,
  makeNimiColumn,
  makeOrganisaatioColumn,
  makeTilaColumn,
} from '#/src/components/ListTable';
import {
  createHeadingCheckbox,
  createRowCheckbox,
} from '#/src/pages/HomePage/EntityListCheckboxes';

export const createHakukohdeListColumns =
  (t: TFunction, organisaatioOid: string) => selectionActor => {
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
          `/organisaatio/${organisaatioOid}/hakukohde/${oid}/muokkaus`,
      }),
      makeOrganisaatioColumn(t),
      makeTilaColumn(t),
      makeModifiedColumn(t),
    ];
  };
