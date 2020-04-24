import React from 'react';

import getKoulutuksenToteutukset from '../../utils/kouta/getKoulutuksenToteutukset';
import { useTranslation } from 'react-i18next';
import RelatedEntitiesTable from '../RelatedEntitiesTable';

export default function({ koulutus, organisaatioOid }) {
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
