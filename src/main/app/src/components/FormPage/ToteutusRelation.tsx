import React from 'react';

import { useTranslation } from 'react-i18next';

import { RelationInfo } from './RelationInfo';

const ToteutusRelation = ({ organisaatioOid, toteutus }) => {
  const { t } = useTranslation();
  return (
    <RelationInfo
      title={t('yleiset.toteutus')}
      entity={toteutus}
      linkUrl={`/organisaatio/${organisaatioOid}/toteutus/${toteutus.oid}/muokkaus`}
    />
  );
};

export default ToteutusRelation;
