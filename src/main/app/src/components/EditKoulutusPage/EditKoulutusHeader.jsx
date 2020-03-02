import React from 'react';
import { get } from 'lodash';

import FormHeader from '../FormHeader';
import StatusTag from '../StatusTag';
import FormEditInfo from '../FormEditInfo';
import useTranslation from '../useTranslation';

const EditKoulutusHeader = ({ koulutus }) => {
  const { t } = useTranslation();

  return (
    <FormHeader
      status={
        get(koulutus, 'tila') ? (
          <StatusTag status={koulutus.tila} large />
        ) : null
      }
      editInfo={
        get(koulutus, 'modified') ? (
          <FormEditInfo
            date={koulutus.modified}
            editorOid={koulutus.muokkaaja}
          />
        ) : null
      }
    >
      {t('yleiset.koulutus')}
    </FormHeader>
  );
};

export default EditKoulutusHeader;
