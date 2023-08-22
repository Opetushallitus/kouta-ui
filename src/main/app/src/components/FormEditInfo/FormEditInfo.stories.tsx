import React from 'react';

import FormEditInfo from './index';

export default {
  title: 'FormEditInfo',
};

export const Basic = () => (
  <FormEditInfo
    entity={{
      muokkaaja: 'Matti Meikäläinen',
      modified: '2011-10-10T10:30',
    }}
    historyUrl="https://google.fi"
  />
);
