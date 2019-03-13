import React from 'react';

import KorkeakouluOsaamisalatFields from './KorkeakoulutuOsaamisalatFields';
import LanguageSelector from '../LanguageSelector';

export const KorkeakouluOsaamisalatSection = ({ languages }) => {
  return (
    <LanguageSelector languages={languages} defaultValue="fi">
      {({ value: language }) => (
        <KorkeakouluOsaamisalatFields language={language} name="osaamisalat" />
      )}
    </LanguageSelector>
  )
};

export default KorkeakouluOsaamisalatSection;
