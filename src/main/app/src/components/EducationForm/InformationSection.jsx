import React from 'react';

import LanguageSelector from '../LanguageSelector';

const InformationSection = ({ languages = [], ...props }) => {
  return (
    <div {...props}>
      <LanguageSelector languages={languages} defaultValue="fi">
        {({ value }) => value}
      </LanguageSelector>
    </div>
  );
};

export default InformationSection;
