import React from 'react';

import JulkaisutilaField from '../JulkaisutilaField';

const JulkaisutilaSection = ({ disabled, name, showArkistoitu }) => {
  return (
    <JulkaisutilaField
      disabled={disabled}
      name={name}
      showArkistoitu={showArkistoitu}
    />
  );
};

export default JulkaisutilaSection;
