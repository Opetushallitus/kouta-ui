import React from 'react';

import { useTranslation } from 'react-i18next';

import { RelatedEntitiesTable } from '#/src/components/RelatedEntitiesTable';
import { useHaunHakukohteet } from '#/src/utils/haku/useHaunHakukohteet';

export const HakukohteetSection = function ({ haku, organisaatioOid }) {
  const { t } = useTranslation();
  const { data: enrichedHaku } = useHaunHakukohteet(
    {
      organisaatioOid,
      hakuOid: haku?.oid,
    },
    { refetchOnWindowFocus: false }
  );

  return (
    <RelatedEntitiesTable
      {...{
        data: enrichedHaku?.hakukohteet,
        getLinkUrl: ({ oid }) =>
          `/organisaatio/${organisaatioOid}/hakukohde/${oid}/muokkaus`,
        noResultsMessage: t('hakulomake.haullaEiHakukohteita'),
      }}
    />
  );
};
