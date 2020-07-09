import React from 'react';

import LiitteetFields from './LiitteetFields';

const LiitteetSection = ({ language, name, organisaatioOid }) => {
  return (
    <LiitteetFields
      name={name}
      language={language}
      organisaatioOid={organisaatioOid}
    />
  );
};

export default LiitteetSection;
