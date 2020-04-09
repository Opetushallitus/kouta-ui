import React from 'react';
import { get } from 'lodash';

import FormHeader from '../FormHeader';
import StatusTag from '../StatusTag';
import FormEditInfo from '../FormEditInfo';
import { useTranslation } from 'react-i18next';

const EditHakukohdeHeader = ({ hakukohde }) => {
  const { t } = useTranslation();

  return (
    <FormHeader
      status={
        get(hakukohde, 'tila') ? (
          <StatusTag status={hakukohde.tila} large />
        ) : null
      }
      editInfo={
        get(hakukohde, 'modified') ? (
          <FormEditInfo
            date={hakukohde.modified}
            editorOid={hakukohde.muokkaaja}
          />
        ) : null
      }
    >
      {t('yleiset.hakukohde')}
    </FormHeader>
  );
};

export default EditHakukohdeHeader;
