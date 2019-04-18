import React from 'react';
import get from 'lodash/get';

import FormHeader from '../FormHeader';
import StatusTag from '../StatusTag';
import FormEditInfo from '../FormEditInfo';

const EditHakuHeader = ({ haku }) => (
  <FormHeader
    status={get(haku, 'tila') ? <StatusTag status={haku.tila} large /> : null}
    editInfo={
      get(haku, 'modified') ? <FormEditInfo date={haku.modified} /> : null
    }
  >
    Haku
  </FormHeader>
);

export default EditHakuHeader;
