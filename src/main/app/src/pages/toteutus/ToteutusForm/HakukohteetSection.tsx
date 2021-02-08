import React from 'react';

import { useTranslation } from 'react-i18next';

import { RelatedEntitiesTable } from '#/src/components/RelatedEntitiesTable';
import getToteutuksenHakukohteet from '#/src/utils/toteutus/getToteutuksenHakukohteet';

export const HakukohteetSection = function ({ toteutus, organisaatioOid }) {
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
};
