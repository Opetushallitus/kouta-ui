import React from 'react';
import { useTranslation } from 'react-i18next';

import getToteutuksenHakukohteet from '#/src/utils/toteutus/getToteutuksenHakukohteet';
import RelatedEntitiesTable from '#/src/components/RelatedEntitiesTable';

export default function ({ toteutus, organisaatioOid }) {
  const { t } = useTranslation();

  return (
    <RelatedEntitiesTable
      {...{
        entity: toteutus,
        organisaatioOid,
        getData: getToteutuksenHakukohteet,
        getLinkUrl: ({ oid }) =>
          `/organisaatio/${organisaatioOid}/hakukohde/${oid}/muokkaus`,
        noResultsMessage: t('toteutuslomake.toteutuksellaEiHakukohteita'),
      }}
    />
  );
}
