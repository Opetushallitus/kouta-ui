import React from 'react';
import get from 'lodash/get';

import FormHeader from '../FormHeader';
import FormStatus from '../FormStatus';
import FormEditInfo from '../FormEditInfo';
import useTranslation from '../useTranslation';

const EditHakukohdeHeader = ({ hakukohde }) => {
  const { t } = useTranslation();

  return (
    <FormHeader
      status={
        get(hakukohde, 'tila') ? <FormStatus status={hakukohde.tila} /> : null
      }
      editInfo={
        get(hakukohde, 'modified') ? (
          <FormEditInfo date={hakukohde.modified} />
        ) : null
      }
    >
      {t('yleiset.hakukohde')}
    </FormHeader>
  );
}

export default EditHakukohdeHeader;
