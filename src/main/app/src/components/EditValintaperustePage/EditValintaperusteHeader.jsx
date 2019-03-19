import React from 'react';
import get from 'lodash/get';

import FormHeader from '../FormHeader';
import FormStatus from '../FormStatus';
import FormEditInfo from '../FormEditInfo';

const EditValintaperusteHeader = ({ valintaperuste }) => (
  <FormHeader
    status={
      get(valintaperuste, 'tila') ? <FormStatus status={valintaperuste.tila} /> : null
    }
    editInfo={
      get(valintaperuste, 'modified') ? (
        <FormEditInfo date={valintaperuste.modified} />
      ) : null
    }
  >
    Valintaperusteet
  </FormHeader>
);

export default EditValintaperusteHeader;
