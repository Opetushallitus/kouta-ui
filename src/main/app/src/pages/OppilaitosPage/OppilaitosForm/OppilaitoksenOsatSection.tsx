import React, { useMemo } from 'react';

import { flow, isNil, map, sortBy } from 'lodash-es';
import { useTranslation } from 'react-i18next';

import ListSpin from '#/src/components/ListSpin';
import ListTable, { makeNimiColumn } from '#/src/components/ListTable';
import { Typography } from '#/src/components/virkailija';
import { ORGANISAATIOTYYPPI } from '#/src/constants';
import { organisaatioMatchesTyyppi } from '#/src/utils/organisaatio/organisaatioMatchesTyyppi';

const OppilaitoksenOsatSection = ({ organisaatio }) => {
  const { t, i18n } = useTranslation();

  const data = organisaatio?.children?.filter(
    organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.TOIMIPISTE)
  );
  const columns = [
    makeNimiColumn(t, {
      getLinkUrl: ({ oid }) => `/organisaatio/${oid}/oppilaitoksen-osa`,
    }),
  ];

  const rows = useMemo(() => {
    return (
      data &&
      flow(
        (arr: Array<any>) =>
          map(arr, (entity: any) => ({ ...entity, key: entity.oid })),
        arr => sortBy(arr, e => e.nimi[i18n.language])
      )(data)
    );
  }, [data, i18n.language]);

  return (
    <>
      {isNil(rows) ? (
        <ListSpin />
      ) : (
        <>
          {rows.length === 0 ? (
            <Typography>{t('oppilaitoslomake.eiOppilaitoksenOsia')}</Typography>
          ) : (
            <ListTable rows={rows} columns={columns} />
          )}
        </>
      )}
    </>
  );
};

export default OppilaitoksenOsatSection;
