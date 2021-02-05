import React from 'react';
import { useTranslation } from 'react-i18next';
import getHaunHakukohteet from '#/src/utils/haku/getHaunHakukohteet';
import { RelatedEntitiesTable } from '#/src/components/RelatedEntitiesTable';

export const HakukohteetSection = function ({ haku, organisaatioOid }) {
  const { t } = useTranslation();

  return (
    <RelatedEntitiesTable
      {...{
        entity: haku,
        organisaatioOid,
        getData: getHaunHakukohteet,
        getLinkUrl: ({ oid }) =>
          `/organisaatio/${organisaatioOid}/hakukohde/${oid}/muokkaus`,
        noResultsMessage: t('hakulomake.haullaEiHakukohteita'),
      }}
    />
  );
};
