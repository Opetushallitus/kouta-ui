import React from 'react';
import get from 'lodash/get';

import FormHeader from '../FormHeader';
import FormStatus from '../FormStatus';
import FormEditInfo from '../FormEditInfo';

const EditToteutusHeader = ({ toteutus }) => (
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
    Koulutuksen toteutus
  </FormHeader>
);

export default EditToteutusHeader;
