import React from 'react';

import LiitteetFields from './LiitteetFields';

const LiitteetSection = ({ language, name }) => {
  return <LiitteetFields name={name} language={language} />;
};

export default LiitteetSection;
