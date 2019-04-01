import React from 'react';
import get from 'lodash/get';

import FormHeader from '../FormHeader';
import FormStatus from '../FormStatus';
import FormEditInfo from '../FormEditInfo';
import useTranslation from '../useTranslation';

const EditKoulutusHeader = ({ koulutus }) => {
  const { t } = useTranslation();

  return (
    <FormHeader
      status={
        get(koulutus, 'tila') ? <FormStatus status={koulutus.tila} /> : null
      }
      editInfo={
        get(koulutus, 'modified') ? (
          <FormEditInfo date={koulutus.modified} />
        ) : null
      }
    >
      {t('yleiset.tutkintoonJohtavaKoulutus')}
    </FormHeader>
  );
}

export default EditKoulutusHeader;
