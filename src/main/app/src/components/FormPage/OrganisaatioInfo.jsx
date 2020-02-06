import React from 'react';
import useTranslation from '../useTranslation';
import { useOrganisaatio } from '../useOrganisaatio';
import { TopInfo } from '../FormPage/TopInfo';

const OrganisaatioInfo = ({ organisaatioOid }) => {
  const { t } = useTranslation();
  const { organisaatio } = useOrganisaatio(organisaatioOid);

  return (
    <TopInfo title={t('yleiset.valittuOrganisaatio')} entity={organisaatio} />
  );
};

export default OrganisaatioInfo;
