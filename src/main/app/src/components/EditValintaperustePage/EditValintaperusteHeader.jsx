import React from 'react';
import get from 'lodash/get';

import FormHeader from '../FormHeader';
import FormStatus from '../FormStatus';
import FormEditInfo from '../FormEditInfo';
import useTranslation from '../useTranslation';

const EditValintaperusteHeader = ({ valintaperuste }) => {
  const { t } = useTranslation();

  return (
    <FormHeader
      status={
        get(valintaperuste, 'tila') ? (
          <FormStatus status={valintaperuste.tila} />
        ) : null
      }
      editInfo={
        get(valintaperuste, 'modified') ? (
          <FormEditInfo date={valintaperuste.modified} />
        ) : null
      }
    >
      {t('yleiset.valintaperusteet')}
    </FormHeader>
  );
};

export default EditValintaperusteHeader;
