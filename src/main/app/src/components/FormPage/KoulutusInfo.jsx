import React from 'react';
import useTranslation from '../useTranslation';
import { TopInfo } from '../FormPage/TopInfo';

const KoulutusInfo = ({ organisaatioOid, koulutus, disableContainer }) => {
  const { t } = useTranslation();
  return (
    <TopInfo
      title={t('yleiset.toteutuksenKoulutus')}
      entity={koulutus}
      link={
        koulutus &&
        `/organisaatio/${organisaatioOid}/koulutus/${koulutus.oid}/muokkaus`
      }
      disableContainer={disableContainer}
    />
  );
};

export default KoulutusInfo;
