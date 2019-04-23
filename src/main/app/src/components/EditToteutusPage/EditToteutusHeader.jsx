import React from 'react';
import get from 'lodash/get';

import FormHeader from '../FormHeader';
import StatusTag from '../StatusTag';
import FormEditInfo from '../FormEditInfo';
import useTranslation from '../useTranslation';

const EditToteutusHeader = ({ toteutus }) => {
  const { t } = useTranslation();

  return (
    <FormHeader
      status={
        get(toteutus, 'tila') ? <StatusTag status={toteutus.tila} large /> : null
      }
      editInfo={
        get(toteutus, 'modified') ? (
          <FormEditInfo date={toteutus.modified} />
        ) : null
      }
    >
      {t('yleiset.koulutuksenToteutus')}
    </FormHeader>
  );
};

export default EditToteutusHeader;
