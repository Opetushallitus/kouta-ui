import React from 'react';
import { useTranslation } from 'react-i18next';

import getKoulutuksenToteutukset from '#/src/utils/koulutus/getKoulutuksenToteutukset';
import RelatedEntitiesTable from '#/src/components/RelatedEntitiesTable';

export default function ({ koulutus, organisaatioOid }) {
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
}
