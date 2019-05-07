import React from 'react';
import get from 'lodash/get';

import FormHeader from '../FormHeader';
import StatusTag from '../StatusTag';
import FormEditInfo from '../FormEditInfo';
import useTranslation from '../useTranslation';

const EditValintaperusteHeader = ({ valintaperuste }) => {
  const { t } = useTranslation();

  return (
    <FormHeader
      status={
        get(valintaperuste, 'tila') ? (
          <StatusTag status={valintaperuste.tila} large />
        ) : null
      }
      editInfo={
        get(valintaperuste, 'modified') ? (
          <FormEditInfo
            date={valintaperuste.modified}
            editorOid={valintaperuste.muokkaaja}
          />
        ) : null
      }
    >
      {t('yleiset.valintaperusteet')}
    </FormHeader>
  );
};

export default EditValintaperusteHeader;
