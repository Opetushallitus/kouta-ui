import React from 'react';

import { TFunction } from 'i18next';

import {
  makeHakuColumn,
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
} from '#/src/pages/HomePage/EntityListCheckboxes';

export const createHakukohdeListColumns =
  (t: TFunction, organisaatioOid: string) => selectionActor => {
    const HeadingCheckbox = createHeadingCheckbox(
      selectionActor,
      ENTITY.HAKUKOHDE
    );
    const RowCheckbox = createRowCheckbox(selectionActor, ENTITY.HAKUKOHDE);
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
      makeHakuColumn(t, {
        getLinkUrl: ({ hakuOid }) =>
          `/organisaatio/${organisaatioOid}/haku/${hakuOid}/muokkaus/`,
      }),
      makeKoulutustyyppiColumn(t),
      makeTilaColumn(t),
      makeModifiedColumn(t),
      makeMuokkaajaColumn(t),
    ];
  };
