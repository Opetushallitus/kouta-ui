import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { RelatedEntitiesTable } from '#/src/components/RelatedEntitiesTable';
import { useToteutuksenHakukohteet } from '#/src/utils/toteutus/useToteutuksenHakukohteet';

export const HakukohteetSection = function ({ toteutus, organisaatioOid }) {
  const { t } = useTranslation();
  const { data: enrichedToteutus } = useToteutuksenHakukohteet(
    {
      organisaatioOid,
      toteutusOid: toteutus?.oid,
    },
    { refetchOnWindowFocus: false }
  );

  // NOTE: For some reason hakutiedon hakukohde does not have oid
  const usedData = useMemo(
    () =>
      enrichedToteutus?.hakukohteet.map(hk => ({
        ...hk,
        oid: hk.hakukohdeOid,
      })),
    [enrichedToteutus]
  );

  return (
    <RelatedEntitiesTable
      {...{
        data: usedData,
        getLinkUrl: ({ oid }) =>
          `/organisaatio/${organisaatioOid}/hakukohde/${oid}/muokkaus`,
        noResultsMessage: t('toteutuslomake.toteutuksellaEiHakukohteita'),
      }}
    />
  );
};
