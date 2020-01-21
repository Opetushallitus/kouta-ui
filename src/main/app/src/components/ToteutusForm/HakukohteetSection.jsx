import React from 'react';
import getToteutuksenHakukohteet from '../../utils/kouta/getToteutuksenHakukohteet';
import RelatedEntitiesTable from '../RelatedEntitiesTable';
import useTranslation from '../useTranslation';

export default function({ toteutus, organisaatioOid }) {
  const { t } = useTranslation();

  return (
    <RelatedEntitiesTable
      {...{
        entity: toteutus,
        organisaatioOid,
        getData: getToteutuksenHakukohteet,
        getLinkUrl: ({ oid }) =>
          `/organisaatio/${organisaatioOid}/hakukohde/${oid}/muokkaus`,
        noResultsMessage: t('hakulomake.toteutuksellaEiHakukohteita'),
      }}
    />
  );
}
