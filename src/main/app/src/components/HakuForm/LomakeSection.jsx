import React from 'react';
import LomakeFields from '../LomakeFields';

const LomakeSection = ({ language }) => {
  return <LomakeFields name="hakulomake" language={language} />;
};

export default LomakeSection;
