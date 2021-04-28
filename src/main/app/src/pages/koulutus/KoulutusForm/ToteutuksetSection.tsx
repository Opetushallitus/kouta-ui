import React from 'react';

import { useTranslation } from 'react-i18next';

import { RelatedEntitiesTable } from '#/src/components/RelatedEntitiesTable';
import { useKoulutuksenToteutukset } from '#/src/utils/koulutus/useKoulutuksenToteutukset';

export const ToteutuksetSection = function ({ koulutus, organisaatioOid }) {
  const { t } = useTranslation();
  const { data: enrichedKoulutus } = useKoulutuksenToteutukset(
    {
      organisaatioOid,
      koulutusOid: koulutus?.oid,
    },
    { refetchOnWindowFocus: false }
  );

  return (
    <RelatedEntitiesTable
      {...{
        data: enrichedKoulutus?.toteutukset,
        getLinkUrl: ({ oid }) =>
          `/organisaatio/${organisaatioOid}/toteutus/${oid}/muokkaus`,
        noResultsMessage: t('koulutuslomake.koulutuksellaEiToteutuksia'),
      }}
    />
  );
};
