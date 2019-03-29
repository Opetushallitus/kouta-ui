import React from 'react';
import get from 'lodash/get';

import FormHeader from '../FormHeader';
import FormStatus from '../FormStatus';
import FormEditInfo from '../FormEditInfo';
import useTranslation from '../useTranslation';

const EditToteutusHeader = ({ toteutus }) => {
  const { t } = useTranslation();

  return (
    <FormHeader
      status={
        get(toteutus, 'tila') ? <FormStatus status={toteutus.tila} /> : null
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
