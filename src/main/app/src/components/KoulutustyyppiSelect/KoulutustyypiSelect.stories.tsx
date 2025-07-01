import React from 'react';

import KoulutustyyppiSelect from './index';

export default {
  title: 'KoulutustyyppiSelect',
  argTypes: {
    onChange: { action: 'changed' },
  },
};

export const Basic = {
  render: props =>
    React.createElement(() => {
      return <KoulutustyyppiSelect {...props} />;
    }),
};
