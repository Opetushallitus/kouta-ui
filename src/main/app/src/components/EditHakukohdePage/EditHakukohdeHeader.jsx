import React from 'react';
import get from 'lodash/get';

import FormHeader from '../FormHeader';
import FormStatus from '../FormStatus';
import FormEditInfo from '../FormEditInfo';

const EditHakukohdeHeader = ({ hakukohde }) => (
  <FormHeader
    status={
      get(hakukohde, 'tila') ? <FormStatus status={hakukohde.tila} /> : null
    }
    editInfo={
      get(hakukohde, 'modified') ? (
        <FormEditInfo date={new Date(hakukohde.modified)} />
      ) : null
    }
  >
    Hakukohde
  </FormHeader>
);

export default EditHakukohdeHeader;
