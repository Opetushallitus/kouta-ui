import React from 'react';
import getHaunHakukohteet from '../../utils/kouta/getHaunHakukohteet';
import RelatedEntitiesTable from '../RelatedEntitiesTable';
import { useTranslation } from 'react-i18next';

export default function({ haku, organisaatioOid }) {
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
}
