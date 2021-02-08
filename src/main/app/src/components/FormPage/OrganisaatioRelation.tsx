import React from 'react';

import { useTranslation } from 'react-i18next';

import { useOrganisaatio } from '#/src/hooks/useOrganisaatio';

import { RelationInfo } from './RelationInfo';

const OrganisaatioRelation = ({ organisaatioOid }) => {
  const { t } = useTranslation();
  const { organisaatio } = useOrganisaatio(organisaatioOid);

  return (
    <RelationInfo
      title={t('yleiset.valittuOrganisaatio')}
      entity={organisaatio}
    />
  );
};

export default OrganisaatioRelation;
