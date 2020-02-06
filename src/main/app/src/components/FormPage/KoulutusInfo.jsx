import React from 'react';
import useTranslation from '../useTranslation';
import { TopInfo } from '../FormPage/TopInfo';

const KoulutusInfo = ({ organisaatioOid, koulutus }) => {
  const { t } = useTranslation();
  return (
    <TopInfo
      title={t('yleiset.koulutus')}
      entity={koulutus}
      link={
        koulutus &&
        `/organisaatio/${organisaatioOid}/koulutus/${koulutus.oid}/muokkaus`
      }
    />
  );
};

export default KoulutusInfo;
