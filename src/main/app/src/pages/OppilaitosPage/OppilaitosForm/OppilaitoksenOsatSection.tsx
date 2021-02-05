import React, { useMemo } from 'react';

import _ from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import ListSpin from '#/src/components/ListSpin';
import ListTable, { makeNimiColumn } from '#/src/components/ListTable';
import { Typography } from '#/src/components/virkailija';
import { ORGANISAATIOTYYPPI } from '#/src/constants';
import { flatFilterHierarkia } from '#/src/utils/organisaatio/hierarkiaHelpers';
import organisaatioMatchesTyyppi from '#/src/utils/organisaatio/organisaatioMatchesTyyppi';

const getOppilaitoksenOsat = oppilaitos => {
  return flatFilterHierarkia(
    oppilaitos?.children ?? [],
    organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.TOIMIPISTE)
  );
};

const OppilaitoksenOsatSection = ({ organisaatio }) => {
  const { t, i18n } = useTranslation();

  const data = getOppilaitoksenOsat(organisaatio);
  const columns = [
    makeNimiColumn(t, {
      getLinkUrl: ({ oid }) => `/organisaatio/${oid}/oppilaitoksen-osa`,
    }),
  ];

  const rows = useMemo(() => {
    return (
      data &&
      _.compose(
        _.sortBy(e => e.nimi[i18n.language]),
        _.map(entity => ({ ...entity, key: entity.oid }))
      )(data)
    );
  }, [data, i18n.language]);

  return (
    <>
      {_.isNil(rows) ? (
        <ListSpin />
      ) : (
        <>
          {rows.length === 0 ? (
            <Typography>Ei oppilaitoksia</Typography>
          ) : (
            <ListTable rows={rows} columns={columns} />
          )}
        </>
      )}
    </>
  );
};

export default OppilaitoksenOsatSection;
