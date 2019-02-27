import React from 'react';
import get from 'lodash/get';

import FormHeader from '../FormHeader';
import FormStatus from '../FormStatus';
import FormEditInfo from '../FormEditInfo';

const EditKoulutusHeader = ({ koulutus }) => (
  <FormHeader
    status={
      get(koulutus, 'tila') ? <FormStatus status={koulutus.tila} /> : null
    }
    editInfo={
      get(koulutus, 'modified') ? (
        <FormEditInfo date={koulutus.modified} />
      ) : null
    }
  >
    Tutkintoon johtava koulutus
  </FormHeader>
);

export default EditKoulutusHeader;
