import React from 'react';
import get from 'lodash/get';

import FormHeader from '../FormHeader';
import FormStatus from '../FormStatus';
import FormEditInfo from '../FormEditInfo';

const EditHakuHeader = ({ haku }) => (
  <FormHeader
    status={
      get(haku, 'tila') ? <FormStatus status={haku.tila} /> : null
    }
    editInfo={
      get(haku, 'modified') ? (
        <FormEditInfo date={new Date(haku.modified)} />
      ) : null
    }
  >
    Haku
  </FormHeader>
);

export default EditHakuHeader;
