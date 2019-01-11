import React from 'react';

import FormHeader from '../FormHeader';
import FormStatus from '../FormStatus';
import FormEditInfo from '../FormEditInfo';

const Header = () => (
  <FormHeader
    status={<FormStatus status="saved" />}
    editInfo={
      <FormEditInfo
        editor="John Doe"
        date={new Date(1547205166507)}
        historyUrl="https://google.fi"
      />
    }
  >
    Tutkintoon johtava koulutus
  </FormHeader>
);

export default Header;
