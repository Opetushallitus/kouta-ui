import React from 'react';
import { useTranslation } from 'react-i18next';
import { RelationInfo } from './RelationInfo';

const HakuRelation = ({ organisaatioOid, haku }) => {
  const { t } = useTranslation();
  return (
    <RelationInfo
      title={t('yleiset.haku')}
      entity={haku}
      linkUrl={
        haku && `/organisaatio/${organisaatioOid}/haku/${haku.oid}/muokkaus`
      }
    />
  );
};

export default HakuRelation;
