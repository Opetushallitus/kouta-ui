import React from 'react';

import { useTranslation } from 'react-i18next';

import { RelatedEntitiesTable } from '#/src/components/RelatedEntitiesTable';
import getKoulutuksenToteutukset from '#/src/utils/koulutus/getKoulutuksenToteutukset';

export const ToteutuksetSection = function ({ koulutus, organisaatioOid }) {
  const { t } = useTranslation();

  return (
    <RelatedEntitiesTable
      {...{
        entity: koulutus,
        organisaatioOid,
        getData: getKoulutuksenToteutukset,
        getLinkUrl: ({ oid }) =>
          `/organisaatio/${organisaatioOid}/toteutus/${oid}/muokkaus`,
        noResultsMessage: t('koulutuslomake.koulutuksellaEiToteutuksia'),
      }}
    />
  );
};
