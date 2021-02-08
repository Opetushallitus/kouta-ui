import React from 'react';

import { useTranslation } from 'react-i18next';

import { RelationInfo } from './RelationInfo';

const KoulutusRelation = ({ organisaatioOid, koulutus }) => {
  const { t } = useTranslation();
  return (
    <RelationInfo
      title={t('yleiset.koulutus')}
      entity={koulutus}
      linkUrl={
        koulutus &&
        `/organisaatio/${organisaatioOid}/koulutus/${koulutus.oid}/muokkaus`
      }
    />
  );
};

export default KoulutusRelation;
