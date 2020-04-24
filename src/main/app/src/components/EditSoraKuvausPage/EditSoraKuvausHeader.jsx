import React from 'react';
import { get } from 'lodash';

import FormHeader from '../FormHeader';
import StatusTag from '../StatusTag';
import FormEditInfo from '../FormEditInfo';
import { useTranslation } from 'react-i18next';

const EditSoraKuvausHeader = ({ soraKuvaus }) => {
  const { t } = useTranslation();

  return (
    <FormHeader
      status={
        get(soraKuvaus, 'tila') ? (
          <StatusTag status={soraKuvaus.tila} large />
        ) : null
      }
      editInfo={
        get(soraKuvaus, 'modified') ? (
          <FormEditInfo
            date={soraKuvaus.modified}
            editorOid={soraKuvaus.muokkaaja}
          />
        ) : null
      }
    >
      {t('yleiset.soraKuvaus')}
    </FormHeader>
  );
};

export default EditSoraKuvausHeader;
