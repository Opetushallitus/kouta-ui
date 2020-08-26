import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash/fp';
import { filterHierarkia } from '#/src/utils/organisaatio/hierarkiaHelpers';
import ListTable, { makeNimiColumn } from '#/src/components/ListTable';
import ListSpin from '#/src/components/ListSpin';
import { ORGANISAATIOTYYPPI } from '#/src/constants';
import organisaatioMatchesTyyppi from '#/src/utils/organisaatio/organisaatioMatchesTyyppi';
import { Typography } from '#/src/components/virkailija';

const getOppilaitoksenOsat = oppilaitos => {
  return filterHierarkia(
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
