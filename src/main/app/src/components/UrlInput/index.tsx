import React from 'react';

import { Input } from '#/src/components/virkailija';

export const UrlInput = ({ onBlur, ...props }) => {
  const usedOnBlur = e => {
    const value: string = e?.target?.value;
    if (value && !value.startsWith('http')) {
      e.target.value = 'http://' + value;
    }
    onBlur(e);
  };

  return <Input onBlur={usedOnBlur} {...props} />;
};
