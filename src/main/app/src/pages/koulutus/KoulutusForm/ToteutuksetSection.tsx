import React from 'react';

import { useTranslation } from 'react-i18next';

import { RelatedEntitiesTable } from '#/src/components/RelatedEntitiesTable';
import { useFilteredToteutukset } from '#/src/utils/toteutus/searchToteutukset';

export const ToteutuksetSection = function ({ koulutus, organisaatioOid }) {
  const { t } = useTranslation();

  const { data } = useFilteredToteutukset(
    { koulutusOid: koulutus?.oid },
    organisaatioOid
  );

  const toteutukset = data?.result;

  return (
    <RelatedEntitiesTable
      {...{
        data: toteutukset,
        getLinkUrl: ({ oid }) =>
          `/organisaatio/${organisaatioOid}/toteutus/${oid}/muokkaus`,
        noResultsMessage: t('koulutuslomake.koulutuksellaEiToteutuksia'),
      }}
    />
  );
};
